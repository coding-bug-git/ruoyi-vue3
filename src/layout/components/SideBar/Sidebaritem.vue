<template>
  <div v-if="!item.hidden" class="test">
    <template
      v-if="
        hasOneShowingChild(item.children, item) &&
        (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
        !item.alwaysShow
      "
    >
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <a-menu-item :key="resolvePath(onlyOneChild.path)">
          <template #icon>
            <ExperimentOutlined />
          </template>
          <span>{{
            item.meta ? item.meta.title : item.children[0].meta.title
          }}</span>
        </a-menu-item>
      </app-link>
    </template>

    <a-sub-menu v-else ref="subMenu" :key="resolvePath(item.path)">
      <template #icon v-if="item.meta">
        <ExperimentOutlined />
      </template>
      <template #title v-if="item.meta">{{ item.meta.title }}</template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </a-sub-menu>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, Ref } from 'vue';
  import { ExperimentOutlined } from '@ant-design/icons-vue';
  import { isExternal } from '@/utils/validate';
  import AppLink from './Link.vue';
  import path from 'path';

  export default defineComponent({
    name: 'SidebarItem',
    components: {
      ExperimentOutlined,
      AppLink
    },
    props: {
      // route object
      item: {
        type: Object,
        required: true
      },
      isNest: {
        type: Boolean,
        default: false
      },
      basePath: {
        type: String,
        default: ''
      }
    },
    setup(prop) {
      let onlyOneChild: Ref<any> = ref(null);

      let hasOneShowingChild = (children: unknown[] = [], parent: any) => {
        if (!children) {
          children = [];
        }
        const showingChildren = children.filter((item: any) => {
          if (item.hidden) {
            return false;
          } else {
            // Temp set(will be used if only has one showing child)
            onlyOneChild.value = item;
            return true;
          }
        });

        // When there is only one child router, the child router is displayed by default
        if (showingChildren.length === 1) {
          return true;
        }

        // Show parent if there are no child router to display
        if (showingChildren.length === 0) {
          onlyOneChild.value = { ...parent, path: '', noShowingChildren: true };
          return true;
        }

        return false;
      };

      let resolvePath = (routePath: any) => {
        if (isExternal(routePath)) {
          return routePath;
        }
        if (isExternal(prop.basePath)) {
          return prop.basePath;
        }
        return path.resolve(prop.basePath, routePath);
      };

      return {
        hasOneShowingChild,
        onlyOneChild,
        resolvePath
      };
    }
  });
</script>

<style></style>
