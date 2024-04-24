<template>
  <el-card style="max-width: 300px">
    <template #header>
      <div class="card-header">
        <span>个人信息</span>
      </div>
    </template>
    <div class="flex flex-col gap-3">
      <div class="relative flex-none w-24 h-24 mx-auto overflow-hidden border rounded-full shadow border-ep bg-gray-50">
        <Image :src="avatar" class="w-full h-full"></Image>
        <div
          class="absolute inset-0 flex items-center justify-center transition-opacity duration-300 bg-black bg-opacity-50 opacity-0 hover:opacity-100">
          <el-icon :size="20" color="#fff" @click="uploadAvatar = true">
            <Camera />
          </el-icon>
        </div>
      </div>

      <div class="flex flex-col gap-3 text-xs">
        <div class="flex justify-between border-b item-center border-ep">
          <div>
            <el-icon>
              <User />
            </el-icon>
            用户名称
          </div>
          <span>{{ user.nickName }}</span>
        </div>
        <div class="flex justify-between border-b item-center border-ep">
          <div>
            <el-icon>
              <Iphone />
            </el-icon>
            手机号
          </div>
          <span>13558661148</span>
        </div>
        <div class="flex justify-between border-b item-center border-ep">
          <div>
            <el-icon>
              <Message />
            </el-icon>
            邮箱
          </div>
          <span>346960620@qq.com</span>
        </div>
        <div class="flex justify-between border-b item-center border-ep">
          <div>
            <el-icon>
              <OfficeBuilding />
            </el-icon>
            所属科室
          </div>
          <span>麻醉科</span>
        </div>
        <div class="flex justify-between border-b item-center border-ep">
          <div>
            <el-icon>
              <Avatar />
            </el-icon>
            角色
          </div>
          <span>超级管理员</span>
        </div>
        <div class="flex justify-between border-b item-center border-ep">
          <div>
            <el-icon>
              <Calendar />
            </el-icon>
            创建日期
          </div>
          <span>2024-01-01 00:00:00</span>
        </div>
      </div>
    </div>
  </el-card>

  <el-dialog v-model="uploadAvatar" title="修改头像" width="500" align-center destroy-on-close
    :close-on-click-modal="false">
    <div v-if="previewUrl.length > 0" class="flex flex-col gap-5">
      <el-alert v-if="progress" type="success" :closable="progress.status === 'success'">
        <template #title>
          <span v-if="progress.status === 'uploading'">
            总进度 {{ progress.percent }}% ,上传速度 {{ progress.speed || '获取中' }}，预计上传时间 {{ progress.expectedTime || '获取中' }}
          </span>
          <span v-if="progress.status === 'success'">
            上传成功，耗时{{ progress.duration }}
          </span>
        </template>
      </el-alert>

      <div class="flex items-start justify-center gap-5">
        <div class="flex flex-col items-center justify-center flex-1 gap-2">
          <div class="overflow-hidden border border-ep" ref="imageContainer" @mousedown="startDrag"
            @mousemove="dragImage" @mouseup="stopDrag" @mouseleave="stopDrag">
            <canvas ref="canvasRef" :width="200" :height="200" style="cursor: move;"></canvas>
          </div>
          <el-slider v-model="scale" placement="bottom" :max="10" :min="0.5" :step="0.1" />
        </div>
        <div class="flex flex-col items-center justify-center flex-1 gap-2">
          <img :src="imageDataUrl" class="border rounded-full border-ep w-28 h-28" alt="" srcset="">
          <span>头像预览</span>
        </div>
      </div>
    </div>

    <el-upload v-else drag :on-change="onChange" :auto-upload="false" :show-file-list="false" :limit="1"
      accept="image/*">
      <el-icon :size="40">
        <Upload />
      </el-icon>
      <div>
        点击或拖动图片到此处
      </div>
      <template #tip>
        <div class="mt-2 text-xs">
          图片宽度*高度至少为150*150像素，大小不超过2MB
        </div>
      </template>
    </el-upload>

    <template #footer>
      <div class="dialog-footer">
        <template v-if="previewUrl.length > 0">
          <el-button @click="previewUrl = ''" v-if="!isUpload">上一步</el-button>
          <el-button type="primary" @click="updateAvatar" v-if="previewUrl.length > 0" :loading="isUpload">{{ isUpload ?
          '上传中' : '上传并保存' }}</el-button>
        </template>
        <el-button v-else @click="uploadAvatar = false">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang='ts'>
import { updateUser } from "@/api/user.api";
import { useCos } from "@/hooks/useCos";
import useStore from "@/store";
import { dataURLtoFile } from "@/utils";
import { Avatar, Calendar, Camera, Iphone, Message, OfficeBuilding, Upload, User } from "@element-plus/icons-vue";
import { UploadFile } from 'element-plus/es/components/upload/src/upload';
import { storeToRefs } from "pinia";

const isUpload = ref(false);

const { user } = storeToRefs(useStore().user);
const avatar = computed(() => {
  return user.value.avatar || new URL("../../assets/img/avatar.jpg", import.meta.url).href;
})

const uploadAvatar = ref(false);
const canvasRef = ref();
const imageDataUrl = ref('');

const previewUrl = ref('');
const onChange = (uploadFile: UploadFile) => {
  console.log(uploadFile.raw);
  const file = uploadFile.raw;
  const reader = new FileReader();
  reader.onload = () => {
    previewUrl.value = `${reader.result}`;
    imageDataUrl.value = `${reader.result}`;
    drawCanvasImage();
  }

  if (file) {
    reader.readAsDataURL(file);
  }
}

const scale = ref(1);
watch(scale, () => {
  drawCanvasImage();
});

const translateX = ref(0);
const translateY = ref(0);
const startX = ref(0);
const startY = ref(0);
const dragging = ref(false);

const startDrag = (event: any) => {
  dragging.value = true;
  startX.value = event.clientX;
  startY.value = event.clientY;
}

const stopDrag = () => {
  dragging.value = false;
}

const dragImage = (event: any) => {
  if (dragging.value) {
    const deltaX = event.clientX - startX.value;
    const deltaY = event.clientY - startY.value;
    translateX.value += deltaX;
    translateY.value += deltaY;
    startX.value = event.clientX;
    startY.value = event.clientY;
    drawCanvasImage();
  }
}

const drawCanvasImage = () => {
  const img = new Image();
  img.onload = () => {
    const canvas = canvasRef.value;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    const scaleX = canvas.width / img.width;
    const scaleY = canvas.height / img.height;
    const scales = Math.min(scaleX, scaleY);
    const scaledWidth = img.width * scale.value * scales;
    const scaledHeight = img.height * scale.value * scales;;
    const centerX = (canvas.width - scaledWidth) / 2 + translateX.value;
    const centerY = (canvas.height - scaledHeight) / 2 + translateY.value;
    tempCtx?.clearRect(0, 0, canvas.width, canvas.height);
    tempCtx?.drawImage(img, centerX, centerY, scaledWidth, scaledHeight);

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 绘制白色背景
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(tempCanvas, 0, 0);
    getImageData();
  };
  img.src = previewUrl.value;
}

const getImageData = () => {
  const canvas = canvasRef.value;
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx?.putImageData(imageData, 0, 0);
  imageDataUrl.value = tempCanvas.toDataURL('image/jpeg');
};

const cos = useCos({
  bucket: 'peach-1322235980', // 存储桶
  region: 'ap-chengdu', // 地区
  prefix: '/avatar/', // 存储桶文件夹路径 /xx/
  stsUrl: 'https://api.zhouxk.fun/sts',
});

const progress = cos.uploadProgress;

const updateAvatar = async () => {
  isUpload.value = true;
  const data: any = await cos.upload({
    uploadBody: dataURLtoFile(imageDataUrl.value, 'avatar.jpg'),
    type: 'jpg'
  });
  const url = `https://${data.Location}`;
  console.log("%c Line:187 🍷 url", "color:#ed9ec7", url);

  const newUser = user.value;
  newUser.avatar = url;
  await updateUser(newUser);
  useStore().user.updateAvatar(url);
  ElMessage.success('头像更新成功！')
  uploadAvatar.value = false;
}
</script>