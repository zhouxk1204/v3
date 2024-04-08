<template>
  <div class="flex flex-col gap-2">

    <img :src="imgSrc" alt="" srcset="">

    <el-upload class="upload-demo" drag :on-change="onChange" :auto-upload="false" :show-file-list="false">
      <el-icon :size="40">
        <Upload />
      </el-icon>
      <div class="el-upload__text">
        点击或拖动图片到此处
      </div>
      <template #tip>
        <div class="el-upload__tip">
          图片宽度*高度至少为150*150像素，大小不超过2MB
        </div>
      </template>
    </el-upload>

    <div class="flex gap-3" v-if="progressInfo.name.length > 0">
      <el-avatar shape="square" :size="50" class="text-2xl">
        <span class="text-lg">
          {{ progressInfo.name.split('.').at(-1)?.toUpperCase() }}
        </span></el-avatar>
      <div class="flex flex-col justify-between flex-1">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="font-bold">{{ progressInfo.name }}</span>
            <el-icon @click="toggleUpload" color="#ccc" v-if="progressInfo.percent < 99" :size="22">
              <VideoPause v-if="progressInfo.status === 'uploading'" />
              <VideoPlay v-if="progressInfo.status === 'paused'" />
            </el-icon>
          </div>
          <span class="text-xs font-bold text-gray-400">
            <span v-if="progressInfo.status === 'success'">{{ progressInfo.total }}</span>
            <span v-else>
              {{ progressInfo.loaded }} / {{ progressInfo.total }}
            </span>
          </span>
        </div>
        <el-progress :percentage="progressInfo.percent" class="flex-1" :text-inside="true" :stroke-width="18"
          :status="progressInfo.status === 'success' ? 'success' : ''" />
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { Upload, VideoPause, VideoPlay } from '@element-plus/icons-vue';
import COS from 'cos-js-sdk-v5';
import { UploadFile, } from 'element-plus';

const progressInfo = ref({
  loaded: "0",
  total: "0",
  speed: "0",
  percent: 0,
  taskId: "", // 用于暂停和继续
  status: 'init',
  name: '',
})

export interface CosOption {
  bucket: string; // 存储桶
  region: string; // 地区
  prefix: string; // 存储桶文件夹路径 /xx/
  stsUrl: string; // 获取临时密钥的后端服务url
  sliceSize?: number; // 触发分块上传的阈值非必须
}

const props = defineProps<{ cosOption: CosOption }>();

const imgSrc = ref('');

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

/**
 * 生成COS上传Key，包括path和文件名
 * @params {string} fileName 文件名
 * @params {string} prefix COS文件路径前缀
 * @returns {string} cloudFilePath
 */
const getCloudFilePath = (fileName: string, prefix: string): string => {
  const temporary = fileName.lastIndexOf(".");
  const fileFormat = fileName.substring(temporary + 1, fileName.length);
  // 文件路径和文件名
  const cloudFilePath = prefix + getSimpleUUID() + "." + fileFormat;
  return cloudFilePath;
}

const cos = new COS({
  Domain: 'cloud.zhouxk.fun', // 自定义源站域名
  Protocol: 'https:', // 请求协议
  getAuthorization: (_, callback) => {
    // getAuthorization 必选参数
    // 初始化时不会调用，只有调用 cos 方法（例如 cos.putObject）时才会进入
    // 异步获取临时密钥
    // 服务端 JS 和 PHP 例子：https://github.com/tencentyun/cos-js-sdk-v5/blob/master/server/
    // 服务端其他语言参考 COS STS SDK ：https://github.com/tencentyun/qcloud-cos-sts-sdk
    // STS 详细文档指引看：https://cloud.tencent.com/document/product/436/14048
    const url = props.cosOption.stsUrl; // url 替换成您自己的后端服务
    const xhr = new XMLHttpRequest();
    let data: any = null;
    let credentials: any = null;
    xhr.open('GET', url, true);
    xhr.onload = function (e: any) {
      try {
        data = JSON.parse(e.target.responseText);
        credentials = data.credentials;
      } catch (e) {
        ElMessage.error(JSON.stringify(e));
      }
      if (!data || !credentials) {
        ElMessage.error(`credentials invalid:\n${JSON.stringify(data, null, 2)}`);
        return console.error('credentials invalid:\n' + JSON.stringify(data, null, 2))
      };
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
  }
});

const onChange = (uploadFile: UploadFile) => {
  const file = uploadFile.raw;
  if (!file) return;

  progressInfo.value.name = file.name;
  // 处理文件名称路径
  const key = getCloudFilePath(file.name, props.cosOption.prefix);

  // 上传文件
  cos.uploadFile({
    Bucket: props.cosOption.bucket,
    Region: props.cosOption.region,
    Key: key,              /* 存储在桶里的对象键（例如:1.jpg，a/b/test.txt，图片.jpg）支持中文，必须字段 */
    Body: file, // 上传文件对象
    SliceSize: props.cosOption.sliceSize ?? 1024 * 1024 * 5,     /* 触发分块上传的阈值，超过5MB使用分块上传，小于5MB使用简单上传。可自行设置，非必须 */
    onTaskReady: (tid: string) => {
      progressInfo.value.taskId = tid;
      progressInfo.value.status = "uploading";
    },
    onProgress: (progressData: COS.ProgressInfo) => {
      const { loaded, total, speed, percent } = progressData;
      console.log(JSON.stringify(progressData));
      progressInfo.value.loaded = convertBitsToBytes(loaded);
      progressInfo.value.total = convertBitsToBytes(total);
      progressInfo.value.speed = `${convertBitsToBytes(speed)}/s`;
      const p = percent * 100;
      if (p === 100) {
        progressInfo.value.percent = 99;
      } else {
        progressInfo.value.percent = p;
      }
    }
  }, (err, data) => {
    if (err) {
      progressInfo.value.status = "exception";
      ElMessage.error(`上传失败: ${err.message}`);
    } else {
      progressInfo.value.status = "success";
      ElMessage.success('上传成功');
      imgSrc.value = `https://${data.Location}`;
      console.log("%c Line:181 🥛 imgSrc.value", "color:#ed9ec7", imgSrc.value);
    }
    progressInfo.value.percent = 100;
  });
}



/**
 * 开始或暂停 cos 下载任务
 */
const toggleUpload = (): void => {
  let { status, taskId } = progressInfo.value;

  if (status === "uploading") {
    // 暂停任务
    cos.pauseTask(taskId);
    progressInfo.value.status = "paused";
  } else if (status === "paused") {
    // 重启任务
    cos.restartTask(taskId);
    progressInfo.value.status = "uploading";
  }
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
}

// 取消上传
onBeforeUnmount(() => {
  const { taskId } = progressInfo.value;
  cos.cancelTask(taskId);
})

</script>
<style lang="scss" scoped></style>