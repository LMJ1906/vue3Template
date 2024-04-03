<template>
  <div id="pdf-container"></div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from "vue";
import * as PdfJs from "pdfjs-dist/legacy/build/pdf.js";
import type { RenderParameters } from "pdfjs-dist/types/src/display/api";
import "pdfjs-dist/web/pdf_viewer.css";
// PdfJs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.9.179/pdf.worker.min.js';
// 需要把 pdf.worker.min.js从node_modules/pdfjs-dist/legacy/build/pdf.worker.min.js 复制到 public 文件夹下
PdfJs.GlobalWorkerOptions.workerSrc = "./pdf/pdf.worker.js";
interface EmitsModel {
  (e: "getPageTotal", pageTotal: number): void;
}
const props = defineProps<{
  page: number;
  url: string;
}>();
const scale = ref(1.5);
const emits = defineEmits<EmitsModel>();
// 渲染多页pdf
PdfJs.getDocument(props.url).promise.then((pdf) => {
  emits("getPageTotal", pdf.numPages);
  for (let i = 1; i <= pdf.numPages; i++) {
    renderPdf(i, pdf);
  }
  // return pdf.getPage(props.page);
});
const renderPdf = (num: number, pdf: any) => {
  pdf.getPage(num).then(async (page: any) => {
    // 获取根元素
    const canvasContainer = document.getElementById("pdf-container");
    // 获取pdf尺寸
    const viewport = page.getViewport({ scale: scale.value });
    const canvas = document.createElement("canvas");
    canvasContainer?.appendChild(canvas);
    const context: CanvasRenderingContext2D =
      (canvas as HTMLCanvasElement)!.getContext(
        "2d"
      ) as unknown as CanvasRenderingContext2D;
    (canvas as HTMLCanvasElement).height = viewport.height;
    (canvas as HTMLCanvasElement).width = viewport.width;
    const renderContext: RenderParameters = {
      canvasContext: context,
      viewport: viewport,
    };
    // 以上为渲染多页pdf  以下为开始渲染复制文本图层
    page.render(renderContext);
  });
};
</script>

<style scoped>
.pdf-container {
  width: 100%;
}
</style>
