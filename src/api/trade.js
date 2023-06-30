import request from '@/utils/request'

export function getTradeList(data) {
  return request({
    url: '/api/trade/list',
    method: 'get',
    params: data
  })
}

export function getTradeListPage(data) {
  return request({
    url: '/api/trade/list/page',
    method: 'get',
    params: data
  })
}

export function addTrade(data) {
  return request({
    url: '/api/trade/add',
    method: 'post',
    params: {},
    data: data
  })
}

export function updateTrade(data) {
  return request({
    url: '/api/trade/update',
    method: 'post',
    params: {},
    data: data
  })
}

export function deleteTrade(data) {
  return request({
    url: '/api/trade/delete',
    method: 'post',
    params: {},
    data: data
  })
}
