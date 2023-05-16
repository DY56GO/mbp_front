import request from '@/utils/request'

export function getList() {
  return request({
    url: '/api/role/list',
    method: 'get',
    params: {}
  })
}

export function getListPage(data) {
  return request({
    url: '/api/role/list/page',
    method: 'get',
    params: data
  })
}

export function addRole(data) {
  return request({
    url: '/api/role/add',
    method: 'post',
    params: {},
    data: data
  })
}

export function updateRole(data) {
  return request({
    url: '/api/role/update',
    method: 'post',
    params: {},
    data: data
  })
}

export function deleteRole(data) {
  return request({
    url: '/api/role/delete',
    method: 'post',
    params: {},
    data: data
  })
}
