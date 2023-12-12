import { createRouter, createWebHistory } from "vue-router";

const metaObj = import.meta.glob("@/views/**/meta.ts", {
  eager: true,
  import: "default",
});

const pageComp = import.meta.glob("@/views/**/index.vue");

const routeMap = new Map();

const detail = Object.entries(metaObj);
detail.sort((a, b) => a[0].split("/").length - b[0].split("/").length);

for (const [path, meta] of Object.entries(metaObj)) {
  const path2 = path.replace("/src/views", "").replace("/meta.ts", "") || "/";
  routeMap.set(path2, meta);
}

let routes: any = [];

for (const [path, meta] of detail) {
  const compPath = path.replace("meta.ts", "index.vue");
  const route = path.replace(/\/src\/views|\/meta.ts/g, "") || "/";
  const parts = route.split("/").filter(Boolean);

  let currentLevel = routes;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const existingNode = currentLevel.find((node: any) => node.path === part);

    if (existingNode) {
      currentLevel = existingNode.children;
    } else {
      const newNode = {
        path: part,
        meta: i === parts.length - 1 ? meta : null,
        name: part,
        component: pageComp[compPath],
        children: [],
      };
      currentLevel.push(newNode);
      currentLevel = newNode.children;
    }
  }
}

routes = routes.map((e: any) => ({ ...e, path: `/${e.path}` }));
console.log("%c Line:50 🍇 routes", "color:#b03734", routes);

// // 导入你的组件
// const routes = [
//   {
//     path: "/login",
//     component: () => import("@/views/login/index.vue"),
//     name: "login",
//     meta: {
//       title: "登录",
//     },
//   },
//   {
//     path: "/photo",
//     component: () => import("@/views/photo/index.vue"),
//     name: "photo",
//     meta: {
//       title: "图片",
//     },
//   },
//   {
//     path: "/marriage",
//     component: () => import("@/views/marriage/index.vue"),
//     name: "marriage",
//     meta: {
//       title: "Love",
//     },
//   },
//   {
//     path: "/sheep",
//     component: () => import("@/views/sheep/index.vue"),
//     name: "sheep",
//     meta: {
//       title: "sheep",
//     },
//   },
//   {
//     path: "/",
//     component: () => import("@/layouts/index.vue"),
//     redirect: "home",
//     children: [
//       {
//         path: "home",
//         component: () => import("@/views/home/index.vue"),
//         name: "home",
//         meta: {
//           title: "首页",
//         },
//       },
//       {
//         path: "game",
//         component: () => import("@/views/game/index.vue"),
//         name: "game",
//         meta: {
//           title: "2048",
//         },
//       },
//       {
//         path: "minesweeper",
//         component: () => import("@/views/minesweeper/index.vue"),
//         name: "minesweeper",
//         meta: {
//           title: "扫雷",
//         },
//       },
//       {
//         path: "report",
//         component: () => import("@/views/report/index.vue"),
//         name: "report",
//         meta: {
//           title: "月次工分汇算",
//         },
//       },
//       {
//         path: "record",
//         component: () => import("@/views/record/index.vue"),
//         name: "record",
//         meta: {
//           title: "月次工分记录",
//         },
//       },
//       {
//         path: "employee",
//         component: () => import("@/views/employee/index.vue"),
//         name: "employee",
//         meta: {
//           title: "职工管理",
//         },
//       },
//       {
//         path: "holiday",
//         component: () => import("@/views/holiday/index.vue"),
//         name: "holiday",
//         meta: {
//           title: "节假日管理",
//         },
//       },
//     ],
//   },
// ];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
