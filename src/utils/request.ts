import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getToken } from '@/utils/auth';
import { Modal, message, notification } from 'ant-design-vue';
import 'ant-design-vue/lib/modal/style/index.css';
import 'ant-design-vue/lib/message/style/index.css';
import 'ant-design-vue/lib/notification/style/index.css';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { createVNode } from 'vue';
import store from '@/store';
import router from '@/router';
import * as errorCode from './errorCode';

const service = axios.create({
  baseURL: process.env.VUE_APP_BASEURL,
  withCredentials: true,
  timeout: 10000
});

service.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';

service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 是否需要设置 token
    const isToken = (config.headers || {}).isToken === false;
    if (getToken() && !isToken) {
      config.headers['Authorization'] = 'Bearer ' + getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    // get请求映射params参数
    if (config.method === 'get' && config.params) {
      let url = config.url + '?';
      for (const propName of Object.keys(config.params)) {
        const value = config.params[propName];
        const part = encodeURIComponent(propName) + '=';
        if (value !== null && typeof value !== 'undefined') {
          if (typeof value === 'object') {
            for (const key of Object.keys(value)) {
              const params = propName + '[' + key + ']';
              const subPart = encodeURIComponent(params) + '=';
              url += subPart + encodeURIComponent(value[key]) + '&';
            }
          } else {
            url += part + encodeURIComponent(value) + '&';
          }
        }
      }
      url = url.slice(0, -1);
      config.params = {};
      config.url = url;
    }
    return config;
  },
  (error: AxiosError) => {
    console.log(error);
    Promise.reject(error);
  }
);

service.interceptors.response.use(
  (res: AxiosResponse) => {
    // 未设置状态码则默认成功状态
    const code: any = res.data.code || 200;

    // 获取错误信息
    const msg =
      errorCode.default[code as keyof typeof errorCode] ||
      res.data.msg ||
      errorCode.default['default'];

    if (code === 401) {
      Modal.confirm({
        title: '系统提示',
        icon: createVNode(ExclamationCircleOutlined),
        okText: '重新登录',
        cancelText: '取消',
        okType: 'danger',
        content: createVNode(
          'div',
          { style: 'color:red;' },
          '登录状态已过期，您可以继续留在该页面，或者重新登录'
        ),
        onOk() {
          store.dispatch('LogOut').then(() => {
            router.push({
              path: '/login'
            });
          });
        },
        onCancel() {
          console.log('Cancel');
        },
        class: 'test'
      });
    } else if (code === 500) {
      message.error(msg);
      return Promise.reject(new Error(msg));
    } else if (code !== 200) {
      notification.error({
        message: msg
      });
      return Promise.reject('error');
    } else {
      return res.data;
    }
  },
  (error: AxiosError) => {
    console.log('err' + error);
    let { message: messageText } = error;
    if (messageText == 'Network Error') {
      messageText = '后端接口连接异常';
    } else if (messageText.includes('timeout')) {
      messageText = '系统接口请求超时';
    } else if (messageText.includes('Request failed with status code')) {
      messageText =
        '系统接口' + messageText.substr(messageText.length - 3) + '异常';
    }
    message.error({
      duration: 5 * 1000,
      content: messageText
    });
    return Promise.reject(error);
  }
);

export default service;
