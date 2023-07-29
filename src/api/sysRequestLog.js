import request from '@/utils/request'

export function getSysRequestLogList(data) {
  return request({
    url: '/api/sysRequestLog/list',
    method: 'get',
    params: data
  })
}

export function getSysRequestLogListPage(data) {
  return request({
    url: '/api/sysRequestLog/list/page',
    method: 'get',
    params: data
  })
}
