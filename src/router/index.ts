import { ROUTE, ROUTE_WHITE_LIST } from "@/constants";
import { createRouter, createWebHistory } from "vue-router";

import { STORAGE_KEY } from "@/constants/storage";

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

routes = routes.map((e: any) => {
  if (e.path === "home") {
    return { ...e, path: `/` };
  } else {
    return { ...e, path: `/${e.path}` };
  }
});

function setDefault(routes: any[]) {
  routes.forEach((route) => {
    if (route.children.length > 0) {
      route.redirect = `${route.path}/${route.meta.defaultRoute}`;
      setDefault(route.children);
    }
  });
}

setDefault(routes);

// 默认路由
routes.push({
  path: "/",
  redirect: "home",
});

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _, next) => {
  // 1.判断是访问登陆页，有 Token 就在当前页面，没有 Token 重置路由并放行到登陆页
  if (to.path === ROUTE.LOGIN) {
    return next();
  }

  // 2.判断访问页面是否在路由白名单(不需要登陆)地址中，如果存在直接放行
  if (ROUTE_WHITE_LIST.includes(to.path)) {
    return next();
  }

  const token = localStorage.getItem(STORAGE_KEY.TOKEN) ?? "";
  // 3.判断是否有 Token，没有token跳转到登陆页面并且携带原目标路径
  if (!token && to.path.includes("main")) {
    ElMessageBox.alert("您还没有登录，请登录！", "提示", {
      confirmButtonText: "去登录",
      type: "warning",
      showClose: false,
      callback: () => {
        next({ path: ROUTE.LOGIN, query: { redirect: to.fullPath } });
      },
    });
    return;
  } else {
    next();
  }
});

export default router;
