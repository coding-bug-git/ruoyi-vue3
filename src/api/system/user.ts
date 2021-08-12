import request from '@/utils/request';

enum Api {
  getTreeSelect = '/system/dept/treeselect',
  getUserList = '/system/user/list'
}

export function getTreeSelect(): unknown {
  return request({
    url: Api.getTreeSelect,
    method: 'GET'
  });
}

// 获取用户列表
export function getUserList(params: unknown): unknown {
  return request({
    url: Api.getUserList,
    method: 'GET',
    params
  });
}
