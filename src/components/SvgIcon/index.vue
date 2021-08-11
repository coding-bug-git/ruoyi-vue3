<template>
  <div
    v-if="isExternal"
    :style="styleExternalIcon"
    class="svg-external-icon svg-icon"
  ></div>
  <svg v-else :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script lang="ts">
  import { computed, defineComponent } from 'vue';
  import { isExternal } from '@/utils/validate';
  export default defineComponent({
    name: 'SvgIcon',
    props: {
      iconClass: {
        type: String,
        required: true,
        default: () => {
          return '';
        }
      },
      className: {
        type: String,
        default: () => {
          return '';
        }
      }
    },
    setup(prop) {
      let isComExternal = computed(() => {
        return isExternal(prop.iconClass);
      });

      let iconName = computed(() => {
        return `#icon-${prop.className}`;
      });

      let svgClass = computed(() => {
        if (prop.className) {
          return 'svg-icon' + prop.className;
        } else {
          return 'svg-icon';
        }
      });

      let styleExternalIcon = computed(() => {
        return {
          mask: `url(${prop.iconClass}) no-repeat 50% 50%`,
          '-webkit-mask': `url(${prop.iconClass}) no-repeat 50% 50%`
        };
      });

      return {
        styleExternalIcon,
        isComExternal,
        iconName,
        svgClass
      };
    }
  });
</script>

<style scoped>
  .svg-icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }

  .svg-external-icon {
    background-color: currentColor;
    mask-size: cover !important;
    display: inline-block;
  }
</style>
