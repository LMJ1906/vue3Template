<template>
  <div class="demo-page">
    <div class="demo-page-nav">
      <el-button-group>
        <el-button type="primary" @click="go('/demo/read')">语音朗读</el-button>
        <el-button type="primary" @click="go('/demo/request')"
          >http请求</el-button
        >
        <el-button type="primary" @click="go('/demo/store')">pinia</el-button>
        <el-button type="primary" @click="go('/demo/viewpdf')"
          >预览PDF</el-button
        >
      </el-button-group>
    </div>
    <di class="demo-page-content">
      <router-view></router-view>
    </di>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
function go(path: string) {
  router.push(path);
}
</script>

<style lang="scss" scoped>
.demo-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  &-nav {
    padding: 10px;
    text-align: center;
  }
  &-content {
    flex: 1;
  }
}
</style>
