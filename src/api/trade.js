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

export function exportTradeExcel(data) {
  return request({
    url: '/api/trade/excel',
    method: 'get',
    params: data,
    responseType: 'blob'
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

export function exportFile(data, type, fileName) {
  const blob = new Blob([data], {
    // type类型后端返回来的数据中会有，根据自己实际进行修改
    // 表格下载为 application/xlsx，压缩包为 application/zip等，
    type: type
  })
  const filename = fileName
  if (typeof window.navigator.msSaveBlob !== 'undefined') {
    window.navigator.msSaveBlob(blob, filename)
  } else {
    var blobURL = window.URL.createObjectURL(blob)
    // 创建隐藏<a>标签进行下载
    var tempLink = document.createElement('a')
    tempLink.style.display = 'none'
    tempLink.href = blobURL
    tempLink.setAttribute('download', filename)
    if (typeof tempLink.download === 'undefined') {
      tempLink.setAttribute('target', '_blank')
    }
    document.body.appendChild(tempLink)
    tempLink.click()
    document.body.removeChild(tempLink)// 移除dom元素
    window.URL.revokeObjectURL(blobURL)// 释放bolb内存
  }
}

