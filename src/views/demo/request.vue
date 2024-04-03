<script setup lang="ts">
/*
 requestIsCache - 判断请求是否开启了缓存
 cancelAllRequest - 取消所有请求
 cancelCurrentRequest - 取消当前请求
*/
import {
  requestIsCache,
  cancelAllRequest,
  cancelCurrentRequest,
} from "-/serves";
import { ElMessage } from "element-plus";
import { chat, history } from "-/demo";

// 发起 chat
const getA = async () => {
  // 缓存函数，如果在接口开启了cache: true,需要在请求前调用此函数
  await requestIsCache("get-ai/chat", 1)
    .then((res) => {
      if (!res) return;
      ElMessage.success("✈️ 本地数据请求成功----" + res);
    })
    .catch(() => {
      // 真正接口
      chat({ text: "张坤" }).then((res) => {
        if (!res) return;
        ElMessage.success("🤖 接口数据-----" + res);
      });
    });
};

// 取消 chat
const cancelA = () => {
  // 在适当的时机调用取消请求（例如点击取消按钮）,不传参数默认取消最后一条请求
  cancelCurrentRequest("get-ai/chat");
};

// 发起 history
const getB = async () => {
  await history().then((res) => {
    if (!res) return;
    ElMessage.success("🤖 接口数据" + res.msg);
  });
};

// 取消 history
const cancelB = () => {
  cancelCurrentRequest();
};

// 取消所有请求
function cancelAll() {
  cancelAllRequest();
}

// https://cn.vuejs.org/api/composition-api-lifecycle.html
onBeforeMount(() => {
  console.log("onBeforeMount");
});
onMounted(() => {
  console.log("onMounted");
});
onBeforeUpdate(() => {
  console.log("onBeforeUpdate");
});
onUpdated(() => {
  console.log("onUpdated");
});
onBeforeUnmount(() => {
  console.log("onBeforeUnmount");
});
onUnmounted(() => {
  console.log("onUnmounted");
});
onActivated(() => {
  console.log("onActivated");
});
onDeactivated(() => {
  console.log("onDeactivated");
});
onErrorCaptured(() => {
  console.log("onErrorCaptured");
});
</script>

<template>
  <div>
    <h1>登录页</h1>
    测试keepAline:<input type="text" />
    <!-- 发起 -->
    <el-button type="primary" @click="getA" class="btnTop">发起A</el-button>
    <!-- 取消 -->
    <el-button type="danger" @click="cancelA" class="btnTop">取消A</el-button>
    <!-- 发起 -->
    <el-button type="primary" @click="getB" class="btnTop">发起B</el-button>
    <!-- 取消 -->
    <el-button type="danger" @click="cancelB" class="btnTop">取消B</el-button>
    <el-button type="danger" @click="cancelAll" class="btnTop"
      >取消所有请求</el-button
    >
  </div>
</template>

<style lang="scss" scoped>
.btnTop {
  position: relative;
  z-index: 99999;
}
</style>
