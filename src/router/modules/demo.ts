export default [
  {
    path: "/demo",
    name: "Demo",
    redirect: "/demo/read",
    component: () => import("@/views/demo/index.vue"),
    children: [
      {
        path: "read",
        name: "Read",
        component: () => import("@/views/demo/read.vue"),
      },
      {
        path: "store",
        name: "store",
        meta: {
          loading: true,
          keepAlive: true,
        },
        component: () => import("@/views/demo/store-view.vue"),
      },
      {
        path: "request",
        name: "Request",
        meta: {
          loading: true,
          keepAlive: true,
        },
        component: () => import("@/views/demo/request.vue"),
      },
      {
        path: "viewpdf",
        name: "Viewpdf",
        meta: {
          loading: true,
          keepAlive: true,
        },
        component: () => import("@/views/demo/view-pdf.vue"),
      },
    ],
  },
];
