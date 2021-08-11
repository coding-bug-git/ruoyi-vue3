import { Module, ActionContext } from 'vuex';

declare interface State {
  visitedViews?: any[];
  cachedViews?: unknown[];
}

enum Mutations {
  ADD_VISITED_VIEW = 'ADD_VISITED_VIEW',
  ADD_CACHED_VIEW = 'ADD_CACHED_VIEW',
  DEL_VISITED_VIEW = 'DEL_VISITED_VIEW',
  DEL_CACHED_VIEW = 'DEL_CACHED_VIEW',
  DEL_OTHERS_VISITED_VIEWS = 'DEL_OTHERS_VISITED_VIEWS',
  DEL_OTHERS_CACHED_VIEWS = 'DEL_OTHERS_CACHED_VIEWS',
  DEL_ALL_VISITED_VIEWS = 'DEL_ALL_VISITED_VIEWS',
  DEL_ALL_CACHED_VIEWS = 'DEL_ALL_CACHED_VIEWS',
  UPDATE_VISITED_VIEW = 'UPDATE_VISITED_VIEW',
  DEL_RIGHT_VIEWS = 'DEL_RIGHT_VIEWS'
}

const tagsView: Module<any, any> = {
  namespaced: true,
  state: {
    visitedViews: [],
    cachedViews: []
  },
  getters: {},
  mutations: {
    [Mutations.ADD_VISITED_VIEW]: (state: State, view: any) => {
      if (state.visitedViews?.some((v: any) => v.path === view.path)) return;
      state.visitedViews?.push(
        Object.assign({}, view, {
          title: view.meta.title || 'no-name'
        })
      );
    },
    [Mutations.ADD_CACHED_VIEW]: (state: State, view: any) => {
      if (state.cachedViews?.includes(view.name)) return;
      if (!view.meta.noCache) {
        state.cachedViews?.push(view.name);
      }
    },
    [Mutations.DEL_VISITED_VIEW]: (state: any, view: any) => {
      for (const [i, v] of state.visitedViews?.entries()) {
        if (v.path === view.path) {
          state.visitedViews?.splice(i, 1);
          break;
        }
      }
    },
    [Mutations.DEL_CACHED_VIEW]: (state: State, view: any) => {
      const index: any = state.cachedViews?.indexOf(view.name);
      index > -1 && state.cachedViews?.splice(index, 1);
    },
    [Mutations.DEL_OTHERS_VISITED_VIEWS]: (state: State, view: any) => {
      state.visitedViews = state.visitedViews?.filter((v: any) => {
        return v.meta.affix || v.path === view.path;
      });
    },
    [Mutations.DEL_OTHERS_CACHED_VIEWS]: (state: State, view: any) => {
      const index: any = state.cachedViews?.indexOf(view.name);
      if (index > -1) {
        state.cachedViews = state.cachedViews?.slice(index, index + 1);
      } else {
        state.cachedViews = [];
      }
    },
    [Mutations.DEL_ALL_VISITED_VIEWS]: (state: State) => {
      // keep affix tags
      const affixTags = state.visitedViews?.filter((tag) => tag.meta.affix);
      state.visitedViews = affixTags;
    },
    [Mutations.DEL_ALL_CACHED_VIEWS]: (state: State) => {
      state.cachedViews = [];
    },
    [Mutations.UPDATE_VISITED_VIEW]: (state: State, view: any) => {
      for (let v of state.visitedViews as any) {
        if (v.path === view.path) {
          v = Object.assign(v, view);
          break;
        }
      }
    },
    [Mutations.DEL_RIGHT_VIEWS]: (state: State, view: any) => {
      const index: any = state.visitedViews?.findIndex(
        (v) => v.path === view.path
      );
      if (index === -1) {
        return;
      }
      state.visitedViews = state.visitedViews?.filter((item, idx) => {
        if (idx <= index || (item.meta && item.meta.affix)) {
          return true;
        }
        const i: any = state.cachedViews?.indexOf(item.name);
        if (i > -1) {
          state.cachedViews?.splice(i, 1);
        }
        return false;
      });
    }
  },
  actions: {
    addView({ dispatch }: ActionContext<unknown, unknown>, view: unknown) {
      dispatch('addVisitedView', view);
      dispatch('addCachedView', view);
    },
    addVisitedView({ commit }: ActionContext<unknown, unknown>, view: unknown) {
      commit(Mutations.ADD_VISITED_VIEW, view);
    },
    addCachedView({ commit }: ActionContext<unknown, unknown>, view) {
      commit(Mutations.ADD_CACHED_VIEW, view);
    },

    delView({ dispatch, state }: ActionContext<any, unknown>, view: unknown) {
      return new Promise((resolve) => {
        dispatch('delVisitedView', view);
        dispatch('delCachedView', view);
        resolve({
          visitedViews: [...state.visitedViews],
          cachedViews: [...state.cachedViews]
        });
      });
    },
    delVisitedView(
      { commit, state }: ActionContext<any, unknown>,
      view: unknown
    ) {
      return new Promise((resolve) => {
        commit(Mutations.DEL_VISITED_VIEW, view);
        resolve([...state.visitedViews]);
      });
    },
    delCachedView(
      { commit, state }: ActionContext<any, unknown>,
      view: unknown
    ) {
      return new Promise((resolve) => {
        commit(Mutations.DEL_CACHED_VIEW, view);
        resolve([...state.cachedViews]);
      });
    },

    delOthersViews(
      { dispatch, state }: ActionContext<any, unknown>,
      view: unknown
    ) {
      return new Promise((resolve) => {
        dispatch('delOthersVisitedViews', view);
        dispatch('delOthersCachedViews', view);
        resolve({
          visitedViews: [...state.visitedViews],
          cachedViews: [...state.cachedViews]
        });
      });
    },
    delOthersVisitedViews(
      { commit, state }: ActionContext<any, unknown>,
      view: unknown
    ) {
      return new Promise((resolve) => {
        commit(Mutations.DEL_OTHERS_VISITED_VIEWS, view);
        resolve([...state.visitedViews]);
      });
    },
    delOthersCachedViews(
      { commit, state }: ActionContext<any, unknown>,
      view: unknown
    ) {
      return new Promise((resolve) => {
        commit(Mutations.DEL_OTHERS_CACHED_VIEWS, view);
        resolve([...state.cachedViews]);
      });
    },

    delAllViews(
      { dispatch, state }: ActionContext<any, unknown>,
      view: unknown
    ) {
      return new Promise((resolve) => {
        dispatch('delAllVisitedViews', view);
        dispatch('delAllCachedViews', view);
        resolve({
          visitedViews: [...state.visitedViews],
          cachedViews: [...state.cachedViews]
        });
      });
    },
    delAllVisitedViews({ commit, state }: ActionContext<any, unknown>) {
      return new Promise((resolve) => {
        commit(Mutations.DEL_ALL_VISITED_VIEWS);
        resolve([...state.visitedViews]);
      });
    },
    delAllCachedViews({ commit, state }: ActionContext<any, unknown>) {
      return new Promise((resolve) => {
        commit(Mutations.DEL_ALL_CACHED_VIEWS);
        resolve([...state.cachedViews]);
      });
    },

    updateVisitedView({ commit }: ActionContext<any, unknown>, view: unknown) {
      commit(Mutations.UPDATE_VISITED_VIEW, view);
    },

    delRightTags(
      { commit, state }: ActionContext<any, unknown>,
      view: unknown
    ) {
      return new Promise((resolve) => {
        commit(Mutations.DEL_RIGHT_VIEWS, view);
        resolve([...state.visitedViews]);
      });
    }
  }
};

export default tagsView;
