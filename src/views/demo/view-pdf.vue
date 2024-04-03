<template>
  <v-pdf :page="page" :url="url" @getPageTotal="getPageTotal" />
</template>
<script setup lang="ts">
import { ref } from "vue";
import VPdf from "@/components/v-pdf/index.vue";
const url = "./pdf/test.pdf";
const page = ref(1);
const totalPage = ref(0);
// 将总页数赋值
const getPageTotal = (val: number) => {
  totalPage.value = val;
};
</script>
<style scoped lang="less"></style>
