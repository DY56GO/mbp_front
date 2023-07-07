/**
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
