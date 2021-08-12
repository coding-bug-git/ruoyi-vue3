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
      <a-layout-header
        class="flex justify-between"
        style="background: #fff; padding: 0; height: 55px; line-height: 55px"
      >
        <div>
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
        </div>
        <div>
          <a-dropdown
            class="
              hover:bg-gray-200
              px-6
              h-full
              bg-gray-100
              inline-block
              transition-all
              duration-300
            "
          >
            <a
              class="ant-dropdown-link text-gray-400 hover:text-gray-400"
              @click.prevent
            >
              <a-avatar
                src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              />
              <span class="ml-2">{{ name }}</span>
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item class="hover:text-blue-400">
                  <a href="javascript:;" class="py-1 inline-block text-gray-400"
                    >个人中心</a
                  >
                </a-menu-item>
                <a-menu-item class="hover:text-blue-400">
                  <a href="javascript:;" class="py-1 inline-block text-gray-400"
                    >布局设置</a
                  >
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item class="hover:text-blue-400">
                  <a
                    href="javascript:;"
                    class="py-1 inline-block text-gray-400"
                    @click="logout"
                    >退出登录</a
                  >
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>
      <a-layout-content
        :style="{
          margin: '24px 16px',
          padding: '10px',
          background: '#fff',
          overflow: 'auto'
        }"
      >
        <router-view v-if="$route.meta.noCache" />

        <router-view v-slot="{ Component }" v-if="!$route.meta.noCache">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
  import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    ExclamationCircleOutlined
  } from '@ant-design/icons-vue';
  import { computed, defineComponent, ref, createVNode } from 'vue';
  import { Store, useStore } from 'vuex';
  import SideBar from './components/SideBar/index.vue';
  import { Modal } from 'ant-design-vue';
  import { Router, useRouter } from 'vue-router';
  export default defineComponent({
    components: {
      MenuUnfoldOutlined,
      MenuFoldOutlined,
      SideBar
    },
    setup() {
      const store: Store<any> = useStore();
      const router: Router = useRouter();

      let name = computed(() => {
        return store.getters.name;
      });

      let avatar = computed(() => {
        return store.getters.avatar;
      });

      let logout = () => {
        Modal.confirm({
          title: '确定注销并退出系统吗？',
          icon: createVNode(ExclamationCircleOutlined),
          onOk() {
            store.dispatch('LogOut').then(() => {
              router.push({
                path: '/login'
              });
            });
          },
          onCancel() {
            console.log('Cancel');
          },
          class: 'test'
        });
      };

      return {
        selectedKeys: ref<string[]>(['1']),
        collapsed: ref<boolean>(false),
        name,
        avatar,
        logout
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
