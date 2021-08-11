import { Module, ActionContext } from 'vuex';
import Cookies from 'js-cookie';

declare interface State {
  sidebar?: Record<string, unknown>;
  device?: string;
  size?: string;
}

enum Mutations {
  TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR',
  CLOSE_SIDEBAR = 'CLOSE_SIDEBAR',
  TOGGLE_DEVICE = 'TOGGLE_DEVICE',
  SET_SIZE = 'SET_SIZE'
}

const app: Module<any, any> = {
  namespaced: true,
  state: {
    sidebar: {
      opened: Cookies.get('sidebarStatus')
        ? !!+Cookies.get('sidebarStatus')
        : true,
      withoutAnimation: false
    },
    device: 'desktop',
    size: Cookies.get('size') || 'medium'
  },
  getters: {},
  mutations: {
    [Mutations.TOGGLE_SIDEBAR]: (state: State) => {
      state.sidebar!.opened = !state.sidebar?.opened;
      state.sidebar!.withoutAnimation = false;
      if (state.sidebar!.opened) {
        Cookies.set('sidebarStatus', 1);
      } else {
        Cookies.set('sidebarStatus', 0);
      }
    },
    [Mutations.CLOSE_SIDEBAR]: (state: State, withoutAnimation: boolean) => {
      Cookies.set('sidebarStatus', 0);
      state.sidebar!.opened = false;
      state.sidebar!.withoutAnimation = withoutAnimation;
    },
    [Mutations.TOGGLE_DEVICE]: (state: State, device: string) => {
      state.device = device;
    },
    [Mutations.SET_SIZE]: (state: State, size: string) => {
      state.size = size;
    }
  },
  actions: {
    toggleSideBar({ commit }: ActionContext<unknown, unknown>) {
      commit(Mutations.TOGGLE_SIDEBAR);
    },
    closeSideBar(
      { commit }: ActionContext<unknown, unknown>,
      { withoutAnimation }: any
    ) {
      commit(Mutations.CLOSE_SIDEBAR, withoutAnimation);
    },
    toggleDevice({ commit }: ActionContext<unknown, unknown>, device: string) {
      commit(Mutations.TOGGLE_DEVICE, device);
    },
    setSize({ commit }: ActionContext<unknown, unknown>, size: string) {
      commit(Mutations.SET_SIZE, size);
    }
  }
};

export default app;
