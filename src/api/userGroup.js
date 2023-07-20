import request from '@/utils/request'

export function getUserGroupList(data) {
  return request({
    url: '/api/userGroup/list',
    method: 'get',
    params: data
  })
}

export function getUserGroupListPage(data) {
  return request({
    url: '/api/userGroup/list/page',
    method: 'get',
    params: data
  })
}

export function addUserGroup(data) {
  return request({
    url: '/api/userGroup/add',
    method: 'post',
    params: {},
    data: data
  })
}

export function updateUserGroup(data) {
  return request({
    url: '/api/userGroup/update',
    method: 'post',
    params: {},
    data: data
  })
}

export function deleteUserGroup(data) {
  return request({
    url: '/api/userGroup/delete',
    method: 'post',
    params: {},
    data: data
  })
}
