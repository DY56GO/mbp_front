/**
 * 是否是数字
 *
 * @param {string} val
 * @returns {boolean}
 */
export function isNumber(val) {
  // 判断是否是数字。
  const regPos = /^([0-9]+\.?[0-9]*|-[0-9]+\.?[0-9]*)$/
  if (regPos.test(val)) {
    return true
  } else {
    return false
  }
}

/**
 * 数字千分位格式化
 *
 * @param {{string}} number
 * @returns {string}
 */
export function number_format(number, fix) {
  if (isNumber(number)) {
    number = Number(number)
  } else {
    number = 0
  }

  // 1.保留的小数位数
  if (fix) {
    number = number.toFixed(fix)
  }
  // 2.先判断是否是负数
  const isMinus = String(number).split('')[0] === '-'
  const data = isMinus ? String(number).split('').splice(1).join('') : number
  // 3.转为字符串，并按照.拆分
  const arr = (data + '').split('.')
  // 4.整数部分再拆分
  const int = arr[0].split('')
  // 5.小数部分
  const fraction = arr[1] || ''
  // 6.返回的变量
  let r = ''
  int.reverse().forEach((v, i) => {
    // 非第一位并且是位值是3的倍数，添加,
    if (i !== 0 && i % 3 === 0) {
      r = v + ',' + r
    } else {
      r = v + r
    }
  })
  // 7.负号，整数部分和小数部分拼接
  return isMinus ? '-' + r + (fraction ? '.' + fraction : '') : r + (fraction ? '.' + fraction : '')
}

/**
 *  返回最小值、下四分位数、中位数、上四分位数、最大值
 *
 * @param {arr} arr
 * @returns
 */
export function computeStatistics(arr) {
  // 对数组进行排序
  const sortedArr = arr.slice().sort((a, b) => a - b)

  // 计算最小值
  const minValue = sortedArr[0].toFixed(2)

  // 计算下四分位数
  const lowerQuartile = computePercentile(sortedArr, 25).toFixed(2)

  // 计算中位数
  const median = computePercentile(sortedArr, 50).toFixed(2)

  // 计算上四分位数
  const upperQuartile = computePercentile(sortedArr, 75).toFixed(2)

  // 计算最大值
  const maxValue = sortedArr[sortedArr.length - 1].toFixed(2)

  // 返回结果数组
  return [minValue, lowerQuartile, median, upperQuartile, maxValue]
}

// 辅助函数用于计算百分位数
function computePercentile(sortedArr, percentile) {
  const index = (percentile / 100) * (sortedArr.length - 1) // 计算对应百分位数的下标

  if (Number.isInteger(index)) {
    // 如果下标是整数，直接返回对应的值
    return sortedArr[index]
  } else {
    // 如果下标是小数，使用线性内插法计算对应的值
    const lowerIndex = Math.floor(index)
    const upperIndex = Math.ceil(index)
    const lowerValue = sortedArr[lowerIndex]
    const upperValue = sortedArr[upperIndex]
    return lowerValue + ((index - lowerIndex) * (upperValue - lowerValue))
  }
}
