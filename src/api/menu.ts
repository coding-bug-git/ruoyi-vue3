import request from '@/utils/request';

enum Api {
  getRouters = '/getRouters'
}

// 获取路由
export const getRouters = () => {
  return request({
    url: Api.getRouters,
    method: 'get'
  });
};
