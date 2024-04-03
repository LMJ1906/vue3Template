<template>
  <div class="speech-page">
    <!-- <div class="speech-page-content">{{ testText }}</div> -->
    <van-notice-bar left-icon="volume-o" :scrollable="false">
      <van-swipe
        vertical
        class="notice-swipe"
        :autoplay="3000"
        :touchable="false"
        :show-indicators="false"
      >
        <van-swipe-item>明月直入，无心可猜。</van-swipe-item>
        <van-swipe-item>仙人抚我顶，结发受长生。</van-swipe-item>
        <van-swipe-item>今人不见古时月，今月曾经照古人。</van-swipe-item>
      </van-swipe>
    </van-notice-bar>
    <el-input v-model="testText" :rows="20" type="textarea" />
    <div class="speech-page-action-wrap" v-show="hasSpeechSynthesis">
      <el-button
        v-show="status == 'notStarted' || status == 'complete'"
        type="primary"
        @click="startSpeech"
        >开始</el-button
      >
      <el-button v-show="status == 'reading'" type="primary" @click="stopSpeech"
        >暂停</el-button
      >
      <el-button
        v-show="status == 'stop'"
        type="primary"
        @click="continueSpeech"
        >继续</el-button
      >
      <el-button type="primary" @click="resetSpeech">重放</el-button>
      <el-select
        style="margin-left: 12px"
        v-model="currentVoice"
        placeholder="Select"
      >
        <el-option
          v-for="item in voiceList"
          :key="item.value"
          :label="item.name"
          :value="item"
        />
      </el-select>
      <el-slider v-model="volume" />
    </div>
  </div>
</template>

<script setup lang="ts">
const utterance = ref(null as any);
// 未开始：notStarted，暂停：stop，朗读中：reading, 结束: complete
const status = ref("notStarted");
const hasSpeechSynthesis = ref(true);
const voiceList = ref([] as any);
const currentVoice = ref({} as any);
const volume = ref(50);
const initText =
  "当我走进那片茂密的森林，我仿佛进入了一个神秘的世界。阳光透过树叶的缝隙洒在地面上，形成斑驳的光影。微风吹过，树叶发出沙沙的声音，仿佛在为我的到来欢呼。我深吸一口清新的空气，感受着大自然的气息。在这片森林中，我看到了各种各样的生物。小鸟在树枝上欢快地歌唱，蝴蝶在花丛中翩翩起舞。我静静地坐在一块石头上，观察着它们的生活。它们似乎不受外界的干扰，自由自在地生活着。我继续向前走去，穿过一片开满鲜花的草地。花朵散发出浓郁的芬芳，吸引着蜜蜂和蝴蝶前来采蜜。我弯下腰，仔细观察着每一朵花的细节，它们的颜色和形状各不相同，但都美丽动人。走过一片湖泊，我看到了一只孤独的天鹅在水中自由自在地游弋。它的白色羽毛在阳光下闪烁着光芒，宛如一颗明亮的明星。我停下脚步，静静地欣赏着它的优雅和自由。在这片森林中，我感受到了大自然的力量和美丽。它让我忘记了城市的喧嚣和压力，让我重新与自然相连。我决定将这份美好带回家，让它成为我生活中的一部分。因为在大自然中，我找到了内心的宁静和平衡。";
const testText = ref(initText);
onMounted(() => {
  checkHasSpeechSynthesis();
});
function checkHasSpeechSynthesis() {
  if ("speechSynthesis" in window) {
    // 浏览器支持Web Speech API
    hasSpeechSynthesis.value = true;
    completeSpeech();
    setTimeout(() => {
      getVoiceList();
    }, 10);
    console.log("浏览器支持Web Speech API");
  } else {
    hasSpeechSynthesis.value = false;
    // 浏览器不支持Web Speech API
  }
}
function initSpeechEvent() {
  utterance.value.onend = function () {
    // 朗读结束
    status.value = "complete";
    console.log("朗读结束");
  };
  utterance.value.onpause = function () {
    // 朗读暂停
    status.value = "stop";
    console.log("朗读暂停");
  };
  utterance.value.onresume = function () {
    // 朗读恢复
    status.value = "reading";
    console.log("朗读恢复");
  };
  utterance.value.onstart = function () {
    // 朗读开始
    status.value = "reading";
    console.log("朗读开始");
  };
}
/**
 * 朗读文字
 * @param text 朗读的文字
 */
function speechText(text: string) {
  // 创建SpeechSynthesisUtterance对象
  utterance.value = new SpeechSynthesisUtterance();
  initSpeechEvent();
  utterance.value.rate = 1; // 设置语速，范围从0.1（最慢）到10（最快）
  utterance.value.volume = volume.value / 100; // 设置音量，范围从0（静音）到1（最大音量）
  utterance.value.voice = currentVoice.value
    ? currentVoice.value
    : speechSynthesis.getVoices()[0]; // 设置语音合成器
  // 设置要朗读的文本
  utterance.value.text = text;
  // 使用默认的语音合成器进行朗读
  speechSynthesis && speechSynthesis.speak(utterance.value);
}
function getVoiceList() {
  if (speechSynthesis) {
    voiceList.value = speechSynthesis
      .getVoices()
      .filter((item) => item.lang == "zh-CN");
    currentVoice.value = voiceList.value[0];
  }
}
function startSpeech() {
  console.log("开始");
  speechText(testText.value);
}
function stopSpeech() {
  console.log("暂停");
  speechSynthesis && speechSynthesis.pause();
}
function continueSpeech() {
  console.log("继续");
  speechSynthesis && speechSynthesis.resume();
}
function completeSpeech() {
  console.log("结束");
  speechSynthesis && speechSynthesis.cancel();
}
function resetSpeech() {
  console.log("重放");
  speechSynthesis && speechSynthesis.cancel();
  speechText(testText.value);
}
</script>

<style lang="scss" scoped>
.speech-page {
  padding: 20px;
  &-action-wrap {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
}
.notice-swipe {
  height: 40px;
  line-height: 40px;
}
</style>
