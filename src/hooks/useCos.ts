import COS, { UploadBody } from "cos-js-sdk-v5";

export interface CosOption {
  bucket: string; // 存储桶
  region: string; // 地区
  prefix: string; // 存储桶文件夹路径 /xx/
  stsUrl: string; // 获取临时密钥的后端服务url
  sliceSize?: number; // 触发分块上传的阈值非必须
}

export function useCos(cosOption: CosOption) {
  const cos = new COS({
    Domain: "cloud.zhouxk.fun", // 自定义源站域名
    Protocol: "https:", // 请求协议
    getAuthorization: (_, callback) => {
      // getAuthorization 必选参数
      // 初始化时不会调用，只有调用 cos 方法（例如 cos.putObject）时才会进入
      // 异步获取临时密钥
      // 服务端 JS 和 PHP 例子：https://github.com/tencentyun/cos-js-sdk-v5/blob/master/server/
      // 服务端其他语言参考 COS STS SDK ：https://github.com/tencentyun/qcloud-cos-sts-sdk
      // STS 详细文档指引看：https://cloud.tencent.com/document/product/436/14048
      const url = cosOption.stsUrl; // url 替换成您自己的后端服务
      const xhr = new XMLHttpRequest();
      let data: any = null;
      let credentials: any = null;
      xhr.open("GET", url, true);
      xhr.onload = function (e: any) {
        try {
          data = JSON.parse(e.target.responseText);
          credentials = data.credentials;
        } catch (e) {
          ElMessage.error(JSON.stringify(e));
        }
        if (!data || !credentials) {
          ElMessage.error(
            `credentials invalid:\n${JSON.stringify(data, null, 2)}`
          );
          return console.error(
            "credentials invalid:\n" + JSON.stringify(data, null, 2)
          );
        }
        callback({
          TmpSecretId: credentials.tmpSecretId,
          TmpSecretKey: credentials.tmpSecretKey,
          SecurityToken: credentials.sessionToken,
          // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
          StartTime: data.startTime, // 时间戳，单位秒，如：1580000000
          ExpiredTime: data.expiredTime, // 时间戳，单位秒，如：1580000000
        });
      };
      xhr.send();
    },
  });

  const uploadProgress = ref();

  const upload = (uploadData: { uploadBody: UploadBody; type: string }) => {
    const sd = new Date().getTime();
    uploadProgress.value = {
      taskId: "",
      status: "",
      total: "",
      loaded: "",
      speed: "",
      percent: 0,
      expectedTime: "",
      duration: "",
    };

    const { bucket, region, sliceSize, prefix } = cosOption;
    const { type, uploadBody } = uploadData;
    // 处理文件名称路径
    const key = prefix + getSimpleUUID() + "." + type;

    return new Promise((resolve, reject) => {
      cos.uploadFile(
        {
          Bucket: bucket,
          Region: region,
          Key: key /* 存储在桶里的对象键（例如:1.jpg，a/b/test.txt，图片.jpg）支持中文，必须字段 */,
          Body: uploadBody, // 上传文件对象
          SliceSize:
            sliceSize ??
            1024 *
              1024 *
              5 /* 触发分块上传的阈值，超过5MB使用分块上传，小于5MB使用简单上传。可自行设置，非必须 */,
          onTaskReady: (tid: string) => {
            uploadProgress.value.taskId = tid;
            uploadProgress.value.status = "uploading";
          },
          onProgress: (progressData: COS.ProgressInfo) => {
            const { loaded, total, speed, percent } = progressData;
            uploadProgress.value.loaded = convertBitsToBytes(loaded);
            uploadProgress.value.total = convertBitsToBytes(total);
            uploadProgress.value.speed = `${convertBitsToBytes(speed)}/s`;
            if (speed > 0) {
              uploadProgress.value.expectedTime = `${(total / speed).toFixed(
                2
              )}s`;
            }
            const p = percent * 100;
            if (p === 100) {
              uploadProgress.value.percent = 99;
            } else {
              uploadProgress.value.percent = p;
            }
          },
        },
        (err, data) => {
          if (err) {
            uploadProgress.value.status = "exception";
            reject(`上传失败: ${err.message}`);
          } else {
            const ed = new Date().getTime();
            uploadProgress.value.status = "success";
            uploadProgress.value.percent = 100;
            uploadProgress.value.duration = `${((ed - sd) / 1000).toFixed(2)}s`;
            resolve(data);
          }
        }
      );
    });
  };

  // const toggleUpload = (progress) => {
  //   let { status, taskId } = progress;

  //   if (status === "uploading") {
  //     // 暂停任务
  //     cos.pauseTask(taskId);
  //     uploadInfo.value.progress.status = "paused";
  //   } else if (status === "paused") {
  //     // 重启任务
  //     cos.restartTask(taskId);
  //     uploadInfo.value.progress.status = "uploading";
  //   }
  // };

  const cancel = (taskId: string) => {
    cos.cancelTask(taskId);
  };

  /**
   * 生成随机文件名称
   * 规则八位随机字符，加下划线连接时间戳
   */
  const getSimpleUUID = () => {
    function rx() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return `${+new Date()}_${rx()}${rx()}`;
  };

  const convertBitsToBytes = (bits: number): string => {
    if (bits < 0) {
      return "Invalid input";
    }

    if (bits < 1024 * 1024) {
      return (bits / 1024).toFixed(2) + " Kb";
    } else if (bits < 1024 * 1024 * 1024) {
      return (bits / (1024 * 1024)).toFixed(2) + " Mb";
    } else {
      return (bits / (1024 * 1024 * 1024)).toFixed(2) + " Gb";
    }
  };

  return {
    upload,
    cancel,
    uploadProgress,
  };
}
