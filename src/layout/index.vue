<template>
  <a-layout class="h-full">
    <a-layout-sider
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      class="hidden lg:block xl:block 2xl:block md:block"
    >
      <div class="logo h-8 m-4"></div>
      <SideBar class="flex-1 overflow-auto" />
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <menu-unfold-outlined
          v-if="collapsed"
          class="trigger text-lg px-6 cursor-pointer"
          @click="() => (collapsed = !collapsed)"
        />
        <menu-fold-outlined
          v-else
          class="trigger text-lg px-6 cursor-pointer"
          @click="() => (collapsed = !collapsed)"
        />
      </a-layout-header>
      <a-layout-content
        :style="{
          margin: '24px 16px',
          padding: '10px',
          background: '#fff',
          overflow: 'auto'
        }"
      >
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
  import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue';
  import { defineComponent, ref } from 'vue';
  import SideBar from './components/SideBar/index.vue';
  export default defineComponent({
    components: {
      MenuUnfoldOutlined,
      MenuFoldOutlined,
      SideBar
    },
    setup() {
      return {
        selectedKeys: ref<string[]>(['1']),
        collapsed: ref<boolean>(false)
      };
    }
  });
</script>

<style lang="scss" scoped>
  .ant-layout .trigger {
    line-height: 64px;
    transition: color 0.3s;
  }

  .ant-layout .trigger:hover {
    color: #1890ff;
  }

  .ant-layout .logo {
    background: rgba(255, 255, 255, 0.3);
  }

  .site-layout .site-layout-background {
    background: #fff;
  }

  ::v-deep .ant-layout-sider-children {
    display: flex;
    flex-direction: column;
  }
</style>
