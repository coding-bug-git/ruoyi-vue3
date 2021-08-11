import request from '@/utils/request';

enum Api {
  list = '/monitor/online/list',
  forceLogout = '/monitor/online'
}

// 查询在线用户列表
export function list(query: unknown): unknown {
  return request({
    url: Api.list,
    method: 'get',
    params: query
  });
}

// 强退用户
export function forceLogout(tokenId: unknown): unknown {
  return request({
    url: Api.forceLogout + '/' + tokenId,
    method: 'delete'
  });
}
