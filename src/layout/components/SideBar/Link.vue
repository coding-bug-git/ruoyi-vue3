<template>
  <component :is="type" v-bind="linkProps(to)">
    <slot></slot>
  </component>
</template>

<script lang="ts">
  import { computed, defineComponent } from 'vue';
  import { isExternal } from '@/utils/validate';
  export default defineComponent({
    props: {
      to: {
        type: String,
        required: true,
        default: () => {
          return '';
        }
      }
    },
    setup(prop) {
      let isComExternal = computed(() => {
        return isExternal(prop.to);
      });

      let type = computed(() => {
        if (isComExternal.value) {
          return 'a';
        }
        return 'router-link';
      });

      let linkProps = (to: string) => {
        if (isComExternal.value) {
          return {
            href: to,
            target: '_blank',
            rel: 'noopener'
          };
        }
        return {
          to: to
        };
      };

      return {
        linkProps,
        type
      };
    }
  });
</script>

<style></style>
