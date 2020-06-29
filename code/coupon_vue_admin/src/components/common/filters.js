/**
 * 工具方法
 * @date    2019-04-10 16:55:06
 */
/**
 * 格式化日期
 * @param {String|Date} value 日期值
 * @param {String} format 日期格式
 * @return {String} 格式化后的日期
 */
export const dateFormat = (value, format) => {
  if (typeof value == 'string') {// value可能是int或Date对象
    // ios下input[type=date] change event，event.target.value == '2017-12-18T21:15:08.234'
    value = value.replace(/-/g, '/').replace('T', ' ').replace(/(\.\d+)?/g, '');
  }
  let date = value instanceof Date ? value : new Date(value),
    o = {
    'M+': date.getMonth() + 1, //月份
    'd+': date.getDate(), //日
    'h+': date.getHours(), //小时
    'm+': date.getMinutes(), //分
    's+': date.getSeconds(), //秒
    'q+': Math.floor((date.getMonth() + 3) / 3), //季度
    'S': date.getMilliseconds() //毫秒
  }, week = {
    '0' : '日',
    '1' : '一',
    '2' : '二',
    '3' : '三',
    '4' : '四',
    '5' : '五',
    '6' : '六'
  };
  if(/(y+)/.test(format)){
    format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  if(/(E+)/.test(format)){
    format = format.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? '星期' : '周') : '') + week[date.getDay() + '']);
  }
  for(let k in o) {
    if(new RegExp('(' + k + ')').test(format)){
      format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
    }
  }
  return format;
};
/**
 * 解决js加法精度误差
 * @param {Number} value1
 * @param {Number} value2
 * @return {Number} 两数之和
 */
export const add = (value1, value2) => {
  let r1, r2, m, c;
  try {
    r1 = value1.toString().split('.')[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = value2.toString().split('.')[1].length;
  } catch (e) {
    r2 = 0;
  }
  c = Math.abs(r1 - r2);
  m = Math.pow(10, Math.max(r1, r2));
  if (c > 0) {
    let cm = Math.pow(10, c);
    if (r1 > r2) {
      value1 = Number(value1.toString().replace('.', ''));
      value2 = Number(value2.toString().replace('.', '')) * cm;
    } else {
      value1 = Number(value1.toString().replace('.', '')) * cm;
      value2 = Number(value2.toString().replace('.', ''));
    }
  } else {
    value1 = Number(value1.toString().replace('.', ''));
    value2 = Number(value2.toString().replace('.', ''));
  }
  return (value1 + value2) / m;
};
/**
 * 解决js减法误差
 * @param {Number} value1
 * @param {Number} value2
 * @return {Number} 两数之差
 */
export const subtract = (value1, value2) => {
  const max = Math.max(getDecimalLength(value1), getDecimalLength(value2));
  const k = Math.pow(10, max);
  return (multiply(value1, k) - multiply(value2, k)) / k;
};
/**
 * 解决js乘法误差用法
 * @param {Number} value1
 * @param {Number} value2
 */
export const multiply = (value1, value2) => {
  let intValue1 = +(value1 + '').replace('.', ''),
    intValue2 = +(value2 + '').replace('.', ''),
    decimalLength = getDecimalLength(value1) + getDecimalLength(value2),
    result;
  result = (intValue1 * intValue2) / Math.pow(10, decimalLength);
  return result;
};
/**
 * 解决js除法误差用法
 * @param {Number} value1
 * @param {Number} value2
 */
export const division = (value1, value2) => {
  let t1 = 0, t2 = 0, r1, r2;
  try {
    t1 = value1.toString().split('.')[1].length;
  } catch (e) {}
  try {
    t2 = value2.toString().split('.')[1].length;
  } catch (e) {}

  r1 = Number(value1.toString().replace('.', ''));
  r2 = Number(value2.toString().replace('.', ''));
  return (r1 / r2) * Math.pow(10, t2 - t1);
}
const getDecimalLength = (value) => {
  let list = (value + '').split('.'), result = 0;
  if (list[1] !== undefined && list[1].length > 0) {
    result = list[1].length;
  }
  return result;
}
