import { createRouter, createWebHistory } from "vue-router";

// 导入你的组件
const routes = [
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    name: "login",
    meta: {
      title: "登录",
    },
  },
  {
    path: "/photo",
    component: () => import("@/views/photo/index.vue"),
    name: "photo",
    meta: {
      title: "图片",
    },
  },
  {
    path: "/marriage",
    component: () => import("@/views/marriage/index.vue"),
    name: "marriage",
    meta: {
      title: "Love",
    },
  },
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
      // {
      //   path: "report",
      //   component: () => import("@/views/report/index.vue"),
      //   name: "report",
      //   meta: {
      //     title: "月次工分汇算",
      //   },
      // },
      {
        path: "employee",
        component: () => import("@/views/employee/index.vue"),
        name: "employee",
        meta: {
          title: "职工管理",
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
