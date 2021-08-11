import { Module, ActionContext } from 'vuex';
import {
  login,
  logout,
  getInfo,
  loginByPhone,
  loginByVisitor
} from '@/api/login';
import { getToken, setToken, removeToken } from '@/utils/auth';
import { UserInfo } from '@/types/user.interface';

declare interface State {
  token?: unknown;
  name?: string;
  avatar?: string;
  roles?: any[];
  permissions?: any[];
}

enum Mutations {
  SET_TOKEN = 'SET_TOKEN',
  SET_NAME = 'SET_NAME',
  SET_AVATAR = 'SET_AVATAR',
  SET_ROLES = 'SET_ROLES',
  SET_PERMISSIONS = 'SET_PERMISSIONS'
}

const user: Module<any, unknown> = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    permissions: []
  },
  mutations: {
    [Mutations.SET_TOKEN]: (state: State, token: string) => {
      state.token = token;
    },
    [Mutations.SET_NAME]: (state: State, name: string) => {
      state.name = name;
    },
    [Mutations.SET_AVATAR]: (state: State, avatar: string) => {
      state.avatar = avatar;
    },
    [Mutations.SET_ROLES]: (state: State, roles: any[]) => {
      state.roles = roles;
    },
    [Mutations.SET_PERMISSIONS]: (state: State, permission: any[]) => {
      state.permissions = permission;
    }
  },
  actions: {
    Login({ commit }: ActionContext<any, any>, userInfo: UserInfo) {
      const username = userInfo.username!.trim();
      const password = userInfo.password;
      const code = userInfo.code;
      const uuid = userInfo.uuid;
      return new Promise((resolve, reject) => {
        login(username, password as string, code as string, uuid as string)
          .then((res: any) => {
            setToken(res.token);
            commit(Mutations.SET_TOKEN, res.token);
            resolve('');
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 手机验证码登录
    loginByPhone({ commit }: ActionContext<any, any>, userInfo: UserInfo) {
      const phonenumber = userInfo.phonenumber?.trim();
      const code = userInfo.code;
      return new Promise((resolve, reject) => {
        loginByPhone(phonenumber as string, code as string)
          .then((res: any) => {
            setToken(res.token);
            commit(Mutations.SET_TOKEN, res.token);
            resolve('');
          })
          .catch((err) => {
            reject(err);
          });
      });
    },

    // 游客登陆
    loginVisitor({ commit }: ActionContext<any, any>, userInfo: UserInfo) {
      const phonenumber = userInfo.phonenumber?.trim();
      const code = userInfo.code?.trim();
      return new Promise((resolve, reject) => {
        loginByVisitor(phonenumber as string, code as string)
          .then((res: any) => {
            setToken(res.token);
            commit(Mutations.SET_TOKEN, res.token);
            resolve('');
          })
          .catch((err) => {
            reject(err);
          });
      });
    },

    // 获取用户信息
    GetInfo({ commit }: ActionContext<any, any>) {
      return new Promise((resolve, reject) => {
        getInfo()
          .then((res: any) => {
            const user = res.user;
            const avatar =
              user.avatar == ''
                ? 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80'
                : process.env.VUE_APP_BASE_API + user.avatar;
            if (res.roles && res.roles.length > 0) {
              // 验证返回的roles是否是一个非空数组
              commit(Mutations.SET_ROLES, res.roles);
              commit(Mutations.SET_PERMISSIONS, res.permissions);
            } else {
              commit(Mutations.SET_ROLES, ['ROLE_DEFAULT']);
            }
            commit(Mutations.SET_NAME, user.userName);
            commit(Mutations.SET_AVATAR, avatar);
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 退出系统
    LogOut({ commit }: ActionContext<any, any>) {
      return new Promise((resolve, reject) => {
        logout()
          .then(() => {
            commit(Mutations.SET_TOKEN, '');
            commit(Mutations.SET_ROLES, []);
            commit(Mutations.SET_PERMISSIONS, []);
            removeToken();
            resolve('');
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 前端 登出
    FedLogOut({ commit }: ActionContext<any, any>) {
      return new Promise((resolve) => {
        commit(Mutations.SET_TOKEN, '');
        removeToken();
        resolve('');
      });
    }
  }
};

export default user;
