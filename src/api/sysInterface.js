import request from '@/utils/request'

export function refreshSysInterface() {
  return request({
    url: '/api/sysInterface/refresh',
    method: 'get',
    params: {}
  })
}

export function getSysInterfaceList(data) {
  return request({
    url: '/api/sysInterface/list',
    method: 'get',
    params: data
  })
}

export function getSysInterfaceListPage(data) {
  return request({
    url: '/api/sysInterface/list/page',
    method: 'get',
    params: data
  })
}

export function updateSysInterface(data) {
  return request({
    url: '/api/sysInterface/update',
    method: 'post',
    params: {},
    data: data
  })
}
