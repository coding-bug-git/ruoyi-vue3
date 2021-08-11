export declare interface Getters {
  sidebar?: unknown;
  size?: unknown;
  device?: unknown;
  visitedViews?: unknown;
  cachedViews?: unknown;
  token?: unknown;
  avatar?: unknown;
  name?: unknown;
  introduction?: unknown;
  roles?: unknown;
  permissions?: unknown;
  permission_routes?: unknown;
  topbarRouters?: unknown;
  defaultRoutes?: unknown;
  sidebarRouters?: unknown;
}

export declare interface GettersState {
  app?: App;
  tagsView?: TagsView;
  user?: User;
  permission?: Permission;
}

declare interface App {
  sidebar?: unknown;
  size?: unknown;
  device?: unknown;
}

declare interface TagsView {
  visitedViews?: unknown;
  cachedViews?: unknown;
}

declare interface User {
  token?: unknown;
  avatar?: unknown;
  name?: unknown;
  introduction?: unknown;
  roles?: unknown;
  permissions?: unknown;
}

declare interface Permission {
  routes?: unknown;
  topbarRouters?: unknown;
  defaultRoutes?: unknown;
  sidebarRouters?: unknown;
}
