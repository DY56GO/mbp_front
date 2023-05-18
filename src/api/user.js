import request from '@/utils/request'

export function register(data) {
  return request({
    url: '/api/user/register',
    method: 'post',
    data
  })
}

export function login(data) {
  return request({
    url: '/api/user/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/api/user/info',
    method: 'get',
    params: {}
  })
}

export function logout() {
  return request({
    url: '/api/user/logout',
    method: 'post',
    params: {}
  })
}

export function getList() {
  return request({
    url: '/api/user/list',
    method: 'get',
    params: {}
  })
}

export function getListPage(data) {
  return request({
    url: '/api/user/list/page',
    method: 'get',
    params: data
  })
}

export function addUser(data) {
  return request({
    url: '/api/user/add',
    method: 'post',
    params: {},
    data: data
  })
}

export function updateUser(data) {
  return request({
    url: '/api/user/update',
    method: 'post',
    params: {},
    data: data
  })
}

export function updateUserOneself(data) {
  return request({
    url: '/api/user/updateOneself',
    method: 'post',
    params: {},
    data: data
  })
}

export function updatePassword(data) {
  return request({
    url: '/api/user/updatePassword',
    method: 'post',
    params: {},
    data: data
  })
}

export function deleteUser(data) {
  return request({
    url: '/api/user/delete',
    method: 'post',
    params: {},
    data: data
  })
}
