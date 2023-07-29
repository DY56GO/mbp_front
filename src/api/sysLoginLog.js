import request from '@/utils/request'

export function getSysLoginLogList(data) {
  return request({
    url: '/api/sysLoginLog/list',
    method: 'get',
    params: data
  })
}

export function getSysLoginLogListPage(data) {
  return request({
    url: '/api/sysLoginLog/list/page',
    method: 'get',
    params: data
  })
}
