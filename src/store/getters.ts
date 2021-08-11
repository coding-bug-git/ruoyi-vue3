import { Getters, GettersState } from '@/types/store.interface';

const getters: Getters = {
  sidebar: (state: GettersState) => state.app?.sidebar,
  size: (state: GettersState) => state.app?.size,
  device: (state: GettersState) => state.app?.device,
  visitedViews: (state: GettersState) => state.tagsView?.visitedViews,
  cachedViews: (state: GettersState) => state.tagsView?.cachedViews,
  token: (state: GettersState) => state.user?.token,
  avatar: (state: GettersState) => state.user?.avatar,
  name: (state: GettersState) => state.user?.name,
  introduction: (state: GettersState) => state.user?.introduction,
  roles: (state: GettersState) => state.user?.roles,
  permissions: (state: GettersState) => state.user?.permissions,
  permission_routes: (state: GettersState) => state.permission?.routes,
  topbarRouters: (state: GettersState) => state.permission?.topbarRouters,
  defaultRoutes: (state: GettersState) => state.permission?.defaultRoutes,
  sidebarRouters: (state: GettersState) => state.permission?.sidebarRouters
};
export default getters;
