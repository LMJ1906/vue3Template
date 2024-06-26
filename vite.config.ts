// 导入 vite 插件
import { defineConfig, loadEnv, ConfigEnv, UserConfig } from "vite";
// 导入 vue 插件
import vue from "@vitejs/plugin-vue";
// 导入自动导入插件
import AutoImport from "unplugin-auto-import/vite";
// 导入自动注册组件的插件
import Components from "unplugin-vue-components/vite";
// elementPlus按需导入插件
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
//gzip
import viteCompression from "vite-plugin-compression";
// Mock
import { viteMockServe } from "vite-plugin-mock";

import * as path from "path";
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, process.cwd());
  return {
    // 配置打包后的相对路径
    base: "/vue3Template/",
    //配置别名
    resolve: {
      // 需要在tsconfig.json的compilerOptions中配置paths
      alias: {
        "@": path.resolve("./src"), // @代替src
        "~": path.resolve("./src/components"), // @代替src/components
        "-": path.resolve("./src/api"), // @代替src/api
      },
    },

    //  plugins插件
    plugins: [
      vue(), //vue
      viteCompression(), //gzip
      AutoImport({
        //plus按需引入
        resolvers: [ElementPlusResolver()],
        //引入vue 自动注册api插件
        imports: ["vue", "vue-router", "pinia"], // 配置需要自动导入的库
        dts: "./src/types/auto-import.d.ts", // 自动引入生成api的地址
        eslintrc: {
          enabled: false, // 是否开启eslint
          filepath: "./.eslintrc-auto-import.json", // eslint配置文件地址
          globalsPropValue: true, // 是否开启全局变量
        },
      }),
      Components({
        //plus按需引入
        resolvers: [ElementPlusResolver()],
        // 配置需要将哪些后缀类型的文件进行自动按需引入
        extensions: ["vue", "md"],
        dts: "./src/types/components.d.ts", //自动引入生成的组件的地址
      }),
      viteMockServe({
        ignore: /^\_/,
        mockPath: "mock",
        injectCode: `
          import { setupProdMockServer } from '../mock/_createProductionServer';
          setupProdMockServer();
          `,
      }), //mock
    ],
    // 打包配置
    build: {
      outDir: "dist",
      assetsDir: "assets", //指定静态资源存放路径
      sourcemap: false, //是否构建source map 文件
      minify: "terser", // 混淆器，terser构建后文件体积更小
      terserOptions: {
        compress: {
          //生产环境时移除console
          // drop_console: true,
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          compact: true,
          entryFileNames: "static/js/[name]-[hash].js",
          chunkFileNames: "static/js/[name]-[hash].js",
          assetFileNames: "static/[ext]/[name].[ext]",
        },
      },
    },
    // 跨域
    server: {
      //使用IP能访问
      host: "0.0.0.0",
      //端口号
      port: env.VITE_PORT as unknown as number,
      //是否自动打开浏览器
      open: true,
      // 热更新
      hmr: true,
      //设为 true 时若端口已被占用则会直接退出，而不是尝试下一个可用端口
      strictPort: false,
      //自定义代理规则
      proxy: {
        // 选项写法
        "/api": {
          // 1 目标路径 这里相当于公共的地址
          target: "https://xxx.com/api/",
          //2 允许跨域
          changeOrigin: true,
          // 3 重写路径
          rewrite: (path: string) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});
