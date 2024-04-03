import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  CancelTokenSource,
  AxiosError,
  AxiosResponse,
} from "axios";
/* 
	1. 取消重复请求：完全相同的接口在上一个pending状态时，自动取消下一个请求 
	2. 请求失败自动重试： 接口请求后台异常时候， 自动重新发起多次请求， 直到达到所设次数 
	3. 请求接口数据缓存： 接口在设定时间内不会向后台获取数据， 而是直接拿会话存储本地缓存，（关闭当前进程也就是页签就会自动清除）
	4. 父页面单独取消当前请求
	5. 父页面取消所有请求
*/

import { ElMessage, ElMessageBox } from "element-plus";
import { Session } from "@/utils/storage";
// import app from "@/main";
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000,
});

// handlerRequest Start --------------------------------------------------------------------------

// const hideLoading = () =>
//   app.config.globalProperties.$smallLoading.hideLoading();
// const showLoading = () =>
//   app.config.globalProperties.$smallLoading.showLoading();
// requestKey用于缓存接口函数 判断是否存在相同的请求
let requestKey = "";
// 创建一个存储请求的Map对象
const pendingRequests: Map<string, CancelTokenSource> = new Map();

// 取消重复请求的方法
const cancelDuplicateRequest = (config: AxiosRequestConfig): void => {
  requestKey = `${config.method}-${config.url}`; // 生成请求的唯一标识
  // 如果已经存在该请求，则取消该请求
  if (pendingRequests.has(requestKey)) {
    const cancelToken = pendingRequests.get(requestKey);
    cancelToken?.cancel(
      "进行中的重复请求被拦截，请您等待当前请求完成后再发起请求"
    );
  }
  const cancelToken = axios.CancelToken.source(); // 生成一个取消请求的标识
  pendingRequests.set(requestKey, cancelToken); // 将该请求保存到 pendingRequests 中
  config.cancelToken = cancelToken.token; // 设置取消请求的标识
};

type cacheTimestamp = 1 | 2 | 3 | 4 | 5;
/**
 * 接口缓存
 * @method requestIsCache
 * @param { string } payloadUrl 请求方法-/api地址 require
 * @param { number } responseConfigCacheFlag 1-5(分钟) 缓存阈值 require
 * @returns { Promise<any> } 返回一个Promise对象
 * @example
 * > 1. 在需要缓存的接口中添加 cache: true
 * > 2. import { requestIsCache, cancelAllRequest, cancelCurrentRequest } from '/@/utils/request'; // 对应缓存、取消全部请求、取消当前请求
 * > 3. requestIsCache('post-/menu/queryMenuTree', 1) // 注意先调用缓存接口，失败状态下在调用真实接口
 */
function requestIsCache(
  payloadUrl: string,
  responseConfigCacheFlag: cacheTimestamp
): Promise<any> {
  const keys = Object.keys(sessionStorage);
  if (keys.includes(payloadUrl)) {
    // 本地是否有相同key
    // 停留时间
    const stopover =
      Date.now() - JSON.parse(Session.get(payloadUrl))?.cacheTimestamp;
    const isCache = stopover > 1000 * 60 * responseConfigCacheFlag; // 停留时间 > 缓存时间阈值
    // console.log("停留时间", stopover);
    // console.log("判断阈值", 1000 * 60 * responseConfigCacheFlag);
    // console.log("本地是否有相同key", keys.includes(payloadUrl));
    // console.log("是否过期 ==>:", isCache); // 过期 true 未过期 false
    // 缓存未过期
    if (!isCache) {
      // 直接返回本地缓存数据
      const cacheData = Session.get(payloadUrl);
      return Promise.resolve(cacheData);
    } else {
      // 清除缓存
      Session.remove(payloadUrl);
      return Promise.reject("本地不存在当前接口缓存或者缓存已过期");
    }
  } else {
    return Promise.reject("本地不存在当前接口的缓存key");
  }
}

const tipError = (value: string, title: string) => {
  ElMessageBox.alert(value, title, {
    confirmButtonText: "重新登录",
    type: "warning",
  }).then(() => {
    Session.clear(); // 清除临时缓存
    // 清除cookie
    document.cookie.split(";").forEach(function (c) {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    window.location.reload(); // 刷新页面
  });
};

// 请求失败自动重试的方法 请求失败时、响应失败时、重试请求会触发
const retryFailedRequest = async (
  error: AxiosError | AxiosResponse
): Promise<any> => {
  const config = error;
  // 如果没有设置重试次数 则直接返回错误
  if (!config || !config.retry) return Promise.reject(config);
  // 设置重试次数阈值达到后不再重试
  if (config.retryCount >= config.retry) return;
  // 设置重试次数关闭阈值
  config.retryCount = config.retryCount || 0;
  // 重试次数自增
  config.retryCount += 1;
  // 设置重试延时
  const delay = config.retryDelay || 1000;
  // 延时处理
  await new Promise<void>((resolve) => {
    setTimeout(() => resolve(), delay);
  });
  // 需要等待上一次重试结束后才能继续执行
  return await Promise.resolve(service(config));
};

// handlerRequest End --------------------------------------------------------------------------

// Axios 的请求拦截器期望返回一个配置对象，而不是响应对象。如果你试图返回一个响应对象，Axios 将会抛出一个错误。
service.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么？
    const token = Session.get("token");
    if (token) config.headers!["token"] = token; // 在请求头中添加 token
    // 取消重复请求
    cancelDuplicateRequest(config);
    // showLoading();
    return config;
  },
  (error) => {
    // 对请求错误做些什么？
    // hideLoading();
    // 请求失败重试
    retryFailedRequest(error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么？ 这里只返回【成功响应的http状态】数据！
    const {
      config,
      data,
      data: { code, msg },
    } = response;
    // hideLoading();

    // http状态是0 但是code不是0 返回数据是错误的需要return
    if (code !== 0) {
      if (Object.prototype.toLocaleString.call(data) === "[object Blob]")
        return response;
      if (!msg) return ElMessage.error("🤖 响应失败,没有message信息");
      // 如果后台返回的错误码为 100010016 重复登录、100010011 token过期、100010012 token可能被篡改
      const errArr = [100010016, 100010011, 100010012];
      if (errArr.includes(code)) {
        // hideLoading();
        return tipError(msg, "错误提示");
      }
      ElMessage.error(msg);
      // 需要将错误对象返回，在使用页面调用是可以根据错误码做相应的处理
      return data;
    }
    // 给 pendingRequests 标记一个isFinished为true 请求完成的标识,用于取消正在进行中的请求
    const responseKey = `${config.method}-${config.url}`;
    const request = pendingRequests.get(responseKey);
    if (request && request.token) {
      pendingRequests.set(responseKey, { ...request, isFinished: true });
    }
    // 判断是否有缓存
    if (config.cache) {
      const cachedResponse = Session.get(responseKey);
      if (cachedResponse) {
        return cachedResponse;
      } else {
        // 接口有 cache 参数，且缓存不存在，则缓存接口数据,并插入当前时间戳
        data.cacheTimestamp = new Date().getTime();
        Session.set(responseKey, data);
        return data;
      }
    } else {
      return data;
    }
  },
  (error) => {
    // 对响应错误数据做点什么？
    // hideLoading();
    /* 
        axios.isCancel(error) 是 Axios 库中的一个方法，用于判断一个错误对象是否是由于请求取消导致的。
        当使用 axios.CancelToken 取消请求时，会抛出一个带有一个 message 属性的错误对象。
        axios.isCancel(error) 的作用就是判断这个错误对象的类型，如果是由请求取消导致的错误，则返回 true，否则返回 false。
		    console.log('打印cancelToken.cancel('xxx')传入来的值', error.message);
	    */
    if (axios.isCancel(error)) {
      // 只提示请求取消有主动填写的消息 如：cancelToken.cancel('xxx')
      if (error.message !== "canceled")
        ElMessage.error(" 🤖 " + error.message + "---" + requestKey);
    } else {
      // 响应失败重试
      retryFailedRequest(error);
      // 不是由请求取消导致的错误
      let errorMessage; // 错误提示变量
      const statusData = error.response?.data; // 错误data数据
      const describeForNameMap = [
        [
          () => error.message.indexOf("timeout") !== -1,
          () => (errorMessage = "网络超时 🤖"),
        ],
        [
          () => error.message === "Network Error",
          () => (errorMessage = "网络连接错误 🤪"),
        ],

        // 否则 显示错误消息，这里要根据后台返回的数据结构来定
        [() => statusData, () => (errorMessage = statusData.message)],
      ];
      // 获取符合条件的子数组
      const getDescribe = describeForNameMap.find((item) => item[0]());
      // 执行子数组中的函数
      getDescribe && getDescribe[1]();
      ElMessage.error(errorMessage); // 显示错误消息
    }
  }
);

// 取消全部请求的方法
export const cancelAllRequest = (): void => {
  // 创建一个标记 是否取消成功，初始值为false
  let hasCancelled = false;

  // 遍历所有待处理的请求
  pendingRequests.forEach((value) => {
    // 如果请求还没有完成
    if (!value.isFinished) {
      // 取消请求
      value.cancel();
      // 将标记设为true
      hasCancelled = true;
    }
  });

  // 清空待处理请求的集合
  pendingRequests.clear();

  // 至少取消了一个请求，显示提示,防止都是成功请求点击取消按钮时也提示
  if (hasCancelled) {
    ElMessage.success("成功取消全部请求");
  }
};

// 取消当前请求的方法
export const cancelCurrentRequest = (
  payloadCurrentKey: string = requestKey
): void => {
  // 遍历所有待处理的请求
  pendingRequests.forEach((value, key) => {
    // 传过来key和请求的key相同，且请求还没有完成
    if (key === payloadCurrentKey && !value.isFinished) {
      value.cancel();
      pendingRequests.delete(key);
      ElMessage.success("成功取消当前请求");
    }
  });
};

// 导出 service将其命名为serviceAxios , requestIsCache 用于判断是否有缓存
export { service as serviceAxios, requestIsCache };
