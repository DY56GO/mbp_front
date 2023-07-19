import request from '@/utils/request'

export function getDepartmentList(data) {
  return request({
    url: '/api/userGroup/list',
    method: 'get',
    params: data
  })
}

export function getDepartmentListPage(data) {
  return request({
    url: '/api/userGroup/list/page',
    method: 'get',
    params: data
  })
}

export function addDepartment(data) {
  return request({
    url: '/api/userGroup/add',
    method: 'post',
    params: {},
    data: data
  })
}

export function updateDepartment(data) {
  return request({
    url: '/api/userGroup/update',
    method: 'post',
    params: {},
    data: data
  })
}

export function deleteDepartment(data) {
  return request({
    url: '/api/userGroup/delete',
    method: 'post',
    params: {},
    data: data
  })
}
