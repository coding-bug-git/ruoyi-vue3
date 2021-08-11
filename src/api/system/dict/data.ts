import request from '@/utils/request';

enum Api {
  listData = '/system/dict/data/list',
  getData = '/system/dict/data/',
  getDicts = '/system/dict/data/type/',
  addData = '/system/dict/data',
  updateData = '/system/dict/data',
  delData = '/system/dict/data/',
  exportData = '/system/dict/data/export'
}

// 查询字典数据列表
export function listData(query: unknown): any {
  return request({
    url: Api.listData,
    method: 'get',
    params: query
  });
}

// 查询字典数据详细
export function getData(dictCode: unknown): any {
  return request({
    url: Api.getData + dictCode,
    method: 'get'
  });
}

// 根据字典类型查询字典数据信息
export function getDicts(dictType: unknown): any {
  return request({
    url: Api.getDicts + dictType,
    method: 'get'
  });
}

// 新增字典数据
export function addData(data: unknown): any {
  return request({
    url: Api.addData,
    method: 'post',
    data: data
  });
}

// 修改字典数据
export function updateData(data: unknown): any {
  return request({
    url: Api.updateData,
    method: 'put',
    data: data
  });
}

// 删除字典数据
export function delData(dictCode: unknown): any {
  return request({
    url: Api.delData + dictCode,
    method: 'delete'
  });
}

// 导出字典数据
export function exportData(query: unknown): any {
  return request({
    url: Api.exportData,
    method: 'get',
    params: query
  });
}
