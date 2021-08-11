import { Module, ActionContext } from 'vuex';
import { constantRoutes } from '@/router';
import { getRouters } from '@/api/menu';
import Layout from '@/layout/index.vue';
import ParentView from '@/components/ParentView.vue';

declare interface State {
  routes: any[];
  addRoutes: any[];
  defaultRoutes: any[];
  topbarRouters: any[];
  sidebarRouters: any[];
}

enum Mutations {
  SET_ROUTES = 'SET_ROUTES',
  SET_DEFAULT_ROUTES = 'SET_DEFAULT_ROUTES',
  SET_TOPBAR_ROUTES = 'SET_TOPBAR_ROUTES',
  SET_SIDEBAR_ROUTERS = 'SET_SIDEBAR_ROUTERS'
}

const permission: Module<any, any> = {
  state: {
    routes: [],
    addRoutes: [],
    defaultRoutes: [],
    topbarRouters: [],
    sidebarRouters: []
  },
  mutations: {
    [Mutations.SET_ROUTES]: (state: State, routes: any[]) => {
      state.addRoutes = routes;
      state.routes = constantRoutes.concat(routes);
    },
    [Mutations.SET_DEFAULT_ROUTES]: (state: State, routes: any[]) => {
      state.defaultRoutes = constantRoutes.concat(routes);
    },
    [Mutations.SET_TOPBAR_ROUTES]: (state: State, routes: any[]) => {
      // 顶部导航菜单默认添加统计报表栏指向首页
      const index = [
        {
          path: 'index',
          meta: { title: '统计报表', icon: 'dashboard' }
        }
      ];
      state.topbarRouters = routes.concat(index);
    },
    [Mutations.SET_SIDEBAR_ROUTERS]: (state: State, routes: any[]) => {
      state.sidebarRouters = routes;
    }
  },
  actions: {
    // 生成路由
    GenerateRoutes({ commit }: ActionContext<any, any>) {
      return new Promise((resolve) => {
        // 向后端请求路由数据
        getRouters().then((res) => {
          const sdata = JSON.parse(JSON.stringify(res.data));
          const rdata = JSON.parse(JSON.stringify(res.data));
          const sidebarRoutes = filterAsyncRouter(sdata);
          const rewriteRoutes = filterAsyncRouter(rdata, false, true);
          rewriteRoutes.push({ path: '*', redirect: '/404', hidden: true });
          commit(Mutations.SET_ROUTES, rewriteRoutes);
          commit(
            Mutations.SET_SIDEBAR_ROUTERS,
            constantRoutes.concat(sidebarRoutes)
          );
          commit(Mutations.SET_DEFAULT_ROUTES, sidebarRoutes);
          commit(Mutations.SET_TOPBAR_ROUTES, sidebarRoutes);
          resolve(rewriteRoutes);
        });
      });
    }
  }
};

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(
  asyncRouterMap: any,
  _lastRouter: any = false,
  type = false
) {
  return asyncRouterMap.filter((route: any) => {
    if (type && route.children) {
      route.children = filterChildren(route.children);
    }
    if (route.component) {
      // Layout ParentView 组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout;
      } else if (route.component === 'ParentView') {
        route.component = ParentView;
      } else {
        route.component = loadView(route.component);
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type);
    } else {
      delete route['children'];
      delete route['redirect'];
    }
    return true;
  });
}

function filterChildren(childrenMap: any, lastRouter: any = false) {
  let children: any[] = [];
  childrenMap.forEach((el: any) => {
    if (el.children && el.children.length) {
      if (el.component === 'ParentView') {
        el.children.forEach((c: any) => {
          c.path = el.path + '/' + c.path;
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c));
            return;
          }
          children.push(c);
        });
        return;
      }
    }
    if (lastRouter) {
      el.path = lastRouter.path + '/' + el.path;
    }
    children = children.concat(el);
  });
  return children;
}

export const loadView = (view: unknown) => {
  // 路由懒加载
  return () => import(`@/views/${view}.vue`);
};

export default permission;
