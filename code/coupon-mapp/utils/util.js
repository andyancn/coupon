const isFn = (fn)=> {
  return typeof fn === 'function'
}

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 格式化日期
 * @param {String|Date} value 日期值
 * @param {String} format 日期格式
 * @return {String} 格式化后的日期
 */
const formatDate = (value, format) => {
  if (typeof value == 'string') {// value可能是int或Date对象
    // ios下input[type=date] change event，event.target.value == '2017-12-18T21:15:08.234'
    value = value.replace(/-/g, '/').replace('T', ' ').replace(/(\.\d+)?/g, '');
  }
  if (/^\d+$/.test(value) && value.length === 8) {
    // yyyyMMdd格式
    value = value.replace(/(\d{4})(\d{2})/, '$1/$2/');
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
  if (/(y+)/.test(format)){
    format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  if (/(E+)/.test(format)){
    format = format.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? '星期' : '周') : '') + week[date.getDay() + '']);
  }
  for (let k in o) {
    if(new RegExp('(' + k + ')').test(format)){
      format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
    }
  }
  return format;
}

const confirm = obj =>{
  wx.showModal({
    content: obj.content || '',
    title: obj.title || '提示',
    showCancel: obj.showCancel || false,
    cancelText: obj.cancelText || '我知道了',
    cancelColor: obj.cancelColor || '#999',
    confirmText: obj.confirmText || '确定',
    confirmColor: obj.confirmColor || '#5993ff',
    success: function (res) {
      if (res.confirm) {
        isFn(obj.success) && obj.success(res)
      } else {
        isFn(obj.cancelFn) && obj.cancelFn()
      }
    }
  })
 }

const showToast = obj => {
  wx.showToast({
    title: obj.title || '',
    icon: obj.icon || 'none',
    duration: obj.duration || 1500,
    mask: true,
    success: obj.success || null
  })
}

const dataService = {
  /**
   * 调用后端接口封装
   *  @param {object} params 配置选项
   *  @params url 接口地址
   *  @params data 接口参数
   *  @params shoeLoading 是否显示loading框，true为显示，false不显示，默认为true
   */
  requestData: function (params) {
    let datas = params.data;

    let showLoading = params.showLoading === undefined ? true : params.showLoading;
    if (showLoading) {
      wx.showLoading({
        title: params.message || '加载中...',
        mask: true
      })
    }

    const requestTask = wx.request({
      url: params.url,
      data: datas,
      header: params.header || {
        "Content-Type": "application/json"
      },
      method: params.method || 'POST',
      success: function (res) {
        if (showLoading) {
          wx.hideLoading()
        }
        if (res.statusCode == 200) {
          if (params && params.success) {
            params.success(res.data);
          }
        } else {
          if (params && params.fail) {
            params.fail(res)
          } 
        }
      },
      fail: function (res) {
        if (showLoading) {
          wx.hideLoading()
        }
        if (params && params.fail) {
          params.fail(res)
        }
      },
      complete: function (res) {
        params && params.complete && params.complete();
      }
    });
    return requestTask;
  }
}

module.exports = {
  confirm:confirm,
  showToast:showToast,
  formatTime: formatTime,
  formatDate: formatDate,
  requestData: dataService.requestData
}
