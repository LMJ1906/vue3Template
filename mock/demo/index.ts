import { MockMethod } from "vite-plugin-mock";
import { resultSuccess, resultError, baseUrl } from "../_util";
import { ResultEnum } from "../../src/emuns/httpEnum";
const userInfo = {
  name: "test",
  userid: "102021323",
  email: "test@mail.com",
  signature: "海纳百川，有容乃大",
  introduction: "微笑着，努力着，欣赏着",
  title: "交互专家",
  group: "某某某事业群－某某平台部－某某技术部－UED",
  tags: [
    {
      key: "0",
      label: "很有想法的",
    },
  ],
  notifyCount: 12,
  unreadCount: 11,
  country: "China",
  address: "Xiamen City 77",
  phone: "0592-268888888",
};

export default [
  {
    url: `${baseUrl}/demo/api`,
    timeout: 1000,
    method: "get",
    response: () => {
      return resultSuccess(userInfo);
    },
  },
] as MockMethod[];
