import request from '@/utils/request'

export function getMenuList(data) {
  return request({
    url: '/api/menu/list',
    method: 'get',
    params: data
  })
}

export function getMenuListPage(data) {
  return request({
    url: '/api/menu/list/page',
    method: 'get',
    params: data
  })
}

export function addMenu(data) {
  return request({
    url: '/api/menu/add',
    method: 'post',
    params: {},
    data: data
  })
}

export function updateMenu(data) {
  return request({
    url: '/api/menu/update',
    method: 'post',
    params: {},
    data: data
  })
}

export function deleteMenu(data) {
  return request({
    url: '/api/menu/delete',
    method: 'post',
    params: {},
    data: data
  })
}
