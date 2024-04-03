import { createApp } from "vue";
import App from "./App.vue";
import "core-js/features/array/at";

// 使用中文语言包并引入element-plus全局样式
import ElementPlus from "element-plus";
import zhCn from "element-plus/lib/locale/lang/zh-cn";
import "element-plus/dist/index.css";

// 全局样式文件
import "./assets/css/index.scss";

// loading、加密插件、自定义指令、返回顶部组件
import Loading from "vue3-loading-plug";
import EncryptionPlugin from "vue3-encryption-plugin";
import { directives } from "vue3-directive-tools";
// 引入动态路由配置文件
import router from "./router/route-guard";

// 加密 pinia
import SecureLS from "secure-ls";
// 创建 SecureLS 实例
export const ls = new SecureLS({
  encodingType: "aes",
  isCompression: false,
});

import { createPinia } from "pinia"; // 引入pinia
const pinia = createPinia(); // 创建pinia实例
import piniaPersist from "pinia-plugin-persistedstate"; // 引入pinia插件(持久化)

// 打印环境变量，可以看到VITE_API_URL的值，需要在vite.config.ts，注释掉 drop_console: true
// console.log("😂👨🏾‍❤️‍👨🏼==>： ", import.meta.env);
const app = createApp(App);

app
  .use(ElementPlus, {
    locale: zhCn,
  })
  .use(pinia)
  .use(EncryptionPlugin)
  .use(Loading)
  .use(router)
  .use(directives)
  .mount("#app");
pinia.use(piniaPersist);
// 在 Pinia 中注册插件
pinia.use(({ store }) => {
  // 加密状态并存储到 SecureLS 中
  const encryptAndStoreState = () => {
    ls.set(store.$id, store.$state);
  };

  // 解密状态并恢复到 Pinia 中
  // const decryptAndRestoreState = () => {
  // 	const data = ls.get(store.$id);
  // 	store.$state = data;
  // 	return data;
  // };

  // 在每次状态变更时调用加密函数
  store.$subscribe(encryptAndStoreState);
  // 在初始化时调用解密函数
  // decryptAndRestoreState();
});

export default app; // 这里导出app的目的，是为了在后面 ts文件中使用插件
