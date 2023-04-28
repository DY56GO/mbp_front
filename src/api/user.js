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

export function updateInfo(data) {
  return request({
    url: '/api/user/update',
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
