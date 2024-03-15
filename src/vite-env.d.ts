/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly APP_COS_BUCKET: string; // 存储桶
  readonly APP_COS_REGION: string; // 存储桶地区
  readonly APP_COS_BUCKET_DOMAIN: string;
  readonly APP_COS_BUCKET_STS_URL: string;
  readonly APP_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
