<script lang="ts">
  import { defineComponent } from 'vue';
  import { useRoute, RouteLocation, useRouter, Router } from 'vue-router';
  export default defineComponent({
    setup() {
      const route: RouteLocation = useRoute();
      const router: Router = useRouter();
      const { params, query } = route;
      const { path } = params;
      router.replace({
        path: '/' + path,
        query
      });
    }
  });
</script>
