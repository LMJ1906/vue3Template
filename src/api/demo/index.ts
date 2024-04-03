// 导入axios实例中的AxiosResponse泛型接口
import { AxiosResponse } from "axios";
//导入封装的axios请求方法
import request from "-/requestMethod";

//  如果是get请求不需要写method，post请求使用data请求体 默认封装的get
// post示例
//  export const login = (data) => request({ method: "post", url: '/login', data: data });

// get示例
//  export const getUserList = (params) => request({ url: '/users', params });

// put示例
//     export const getEdit = (data) => request({
//      method: "put",
//      data,
//      url: "users/" + data.uid + "/state/" + data.type,
//    })
// mock示例
export const getUserList = (params: any): Promise<AxiosResponse<any, any>> =>
  request({ url: "/demo/api", params, method: "GET" });

export const history = (): Promise<AxiosResponse<any, any>> =>
  request({
    method: "GET",
    url: "common/history",
    cache: true,
    retry: 1,
    // headers: {
    // 	'Content-Type':
    // 		'application/vnd.openxmlformats-officedocument.wordprocessingml.document ',
    // },
    // responseType: 'blob',
  });

/**
 * @name chat接口
 * @param { object }  params 请求参数
 * @description 接口缓存、重试3次（请求、响应失败时）
 */
export const chat = (params: object): Promise<AxiosResponse<any, any>> =>
  request({
    method: "GET",
    url: "ai/chat",
    // cache: true,
    retry: 1,
    params,
  });
