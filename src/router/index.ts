import { createRouter, createWebHistory } from "vue-router";

import { TOKEN } from "@/constants";

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
  const token = localStorage.getItem("TOKEN") ?? "";
  if (to.path.indexOf("main") < 0) {
    next();
  } else if (token === TOKEN) {
    if (to.path === "/login") {
      next("/main");
    } else {
      next();
    }
  } else {
    if (to.path === "/login") {
      next();
    } else {
      ElMessage.error("您还没有登录，请登录！");
      next("/login");
    }
  }
});

export default router;
