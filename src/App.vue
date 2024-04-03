<template>
  <!-- 这是vue3的写法，与vue2的写法有所区别，如果这里使用vue2.x写法，会有警告 -->
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component
        :is="Component"
        :key="$route.name"
        v-if="$route.meta.keepAlive"
      />
    </keep-alive>
    <component
      :is="Component"
      :key="$route.name"
      v-if="!$route.meta.keepAlive"
    />
  </router-view>
</template>

<script lang="ts"></script>
