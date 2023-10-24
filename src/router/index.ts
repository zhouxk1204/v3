import { createRouter, createWebHistory } from "vue-router";

// 导入你的组件
const routes = [
  {
    path: "/",
    component: () => import("@/layouts/index.vue"),
    redirect: "home",
    children: [
      {
        path: "home",
        component: () => import("@/views/home/index.vue"),
        name: "home",
        meta: {
          title: "首页",
        },
      },
      {
        path: "holiday",
        component: () => import("@/views/holiday/index.vue"),
        name: "holiday",
        meta: {
          title: "节假日管理",
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
