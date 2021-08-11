<template>
  <a-menu theme="dark" mode="inline" v-model:selectedKeys="activeMenu">
    <sidebar-item
      v-for="(route, index) in sidebarRouters"
      :key="route.path + index"
      :item="route"
      :base-path="route.path"
    />
  </a-menu>
</template>

<script lang="ts">
  import { computed, defineComponent, onMounted, ref, Ref } from 'vue';
  import { useRoute, RouteLocation } from 'vue-router';
  import { useStore, Store } from 'vuex';
  import SidebarItem from './Sidebaritem.vue';
  export default defineComponent({
    components: {
      SidebarItem
    },
    setup() {
      const store: Store<any> = useStore();
      const route: RouteLocation = useRoute();

      let sidebarRouters = computed(() => {
        return store.getters.sidebarRouters;
      });

      let activeMenu: Ref<unknown[]> = ref([]);

      let selectedKeys = computed(() => {
        if (route.meta.activeMenu) {
          return [route.meta.activeMenu];
        }
        return [route.path];
      });

      onMounted(() => {
        activeMenu.value = selectedKeys.value;
      });

      return {
        selectedKeys,
        sidebarRouters,
        activeMenu
      };
    }
  });
</script>
