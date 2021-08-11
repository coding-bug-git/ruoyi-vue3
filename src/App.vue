<template>
  <router-view />
</template>

<script lang="ts">
  import { notification } from 'ant-design-vue';
  import 'ant-design-vue/lib/notification/style/index.css';
  import { defineComponent, onMounted } from 'vue';
  export default defineComponent({
    name: 'App',
    setup() {
      let openMessage = () => {
        notification.success({
          message: '欢迎！',
          description: `欢迎使用${process.env.VUE_APP_WEBNAME}`
        });
      };

      onMounted(() => {
        openMessage();
      });
    }
  });
</script>

<style lang="scss">
  html,
  body,
  #app {
    height: 100%;
  }
</style>
