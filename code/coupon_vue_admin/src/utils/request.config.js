/**
 * request.config
 * @date    2019-04-13 15:13:52
 * @version 1.0.0
 */

import axios from 'axios'
import util from './util';

// const BASE_URL = 'https://d.sacs.com.cn/coupon/'
// const BASE_URL = 'http://106.15.237.254:8080/coupon/'
const BASE_URL = 'http://localhost:40011/coupon/'

let ajaxObj = {
  /**
   * 登录
   */
  login(param,callback){
    axios.post( BASE_URL + 'manage/login', param)
    .then(function (response) {
      callback(response)
    })
    .catch(function (error) {
    });
  },
  /**
   * 账号列表
   */
  getAccountList(param,callback){
    axios.post( BASE_URL + 'account/list', param)
    .then(function (response) {
      callback(response)
    })
    .catch(function (error) {
    });
  },
  /**
   * 修改账号
   */
  editAccount(param,callback){
    axios.post( BASE_URL + 'account/update', param)
    .then(function (response) {
      callback(response)
    })
    .catch(function (error) {
    });
  },
  /**
   * 新增账号
   */
  addAccount(param,callback){
    axios.post( BASE_URL + 'account/save', param)
    .then(function (response) {
      callback(response)
    })
    .catch(function (error) {
    });
  },
  /**
   * 渠道列表_分页
   */
  getChannelList(param,callback){
    axios.post( BASE_URL + 'channel/list', param)
    .then(function (response) {
      callback(response)
    })
    .catch(function (error) {
    });
  },
  /**
   * 渠道列表_不分页显示全部
   */
  getAllChannelList(callback){
    let param = {
      channelCode:'',
      enable:1  //只筛选启用的
    };
    axios.post( BASE_URL + 'channel/list_all', param)
    .then(function (response) {
      callback(response)
    })
    .catch(function (error) {
    });
  },
  /**
   * 修改渠道
   */
  editChannel(param,callback){
    axios.post( BASE_URL + 'channel/update', param)
    .then(function (response) {
      callback(response)
    })
    .catch(function (error) {
    });
  },
  /**
   * 新增渠道
   */
  addChannel(param,callback){
    axios.post( BASE_URL + 'channel/save', param)
    .then(function (response) {
      callback(response)
    })
    .catch(function (error) {
    });
  },
  /**
   * 商户列表_分页
   */
  getBusinessList(param,callback){
    axios.post( BASE_URL + 'business/list', param)
    .then(function (response) {
      callback(response)
    })
    .catch(function (error) {
    });
  },
  /**
   * 商户列表_不分页显示全部
   */
  getAllBusinessList(callback){
    let param = {
      businessCode:'',
      enable: 1
    };
    axios.post( BASE_URL + 'business/list_all', param)
    .then(function (response) {
      callback(response)
    })
    .catch(function (error) {
    });
  },
  /**
   * 修改商户信息
   */
  editBusiness(param,callback){
    axios.post( BASE_URL + 'business/update', param)
    .then(function (response) {
      callback(response)
    })
    .catch(function (error) {
    });
  },
  /**
   * 新增商户
   */
  addBusiness(param,callback){
    axios.post( BASE_URL + 'business/save', param)
    .then(function (response) {
      callback(response)
    })
    .catch(function (error) {
    });
  },
  /**
   * 券码种类列表_分页
   */
  getCouponTypeList(param,callback){
    axios.post( BASE_URL + 'coupon_type/list', param)
    .then(function (response) {
      callback(response)
    })
    .catch(function (error) {
    });
  },
  /**
   * 券码种类列表_不分页显示全部
   */
  getAllCouponTypeList(param,callback){
    axios.post( BASE_URL + 'coupon_type/list_all', param)
    .then(function (response) {
      callback(response)
    })
    .catch(function (error) {
    });
  },
  /**
   * 修改券码种类
   */
  editCouponType(param,callback){
    axios.post( BASE_URL + 'coupon_type/update', param)
    .then(function (response) {
      callback(response)
    })
    .catch(function (error) {
    });
  },
  /**
   * 批量新增券码种类
   */
  addCouponType(param,callback){
    axios.post( BASE_URL + 'coupon_type/saves', param)
    .then(function (response) {
      callback(response)
    })
    .catch(function (error) {
    });
  },
  /**
   * 券码列表
   */
  getCouponList(param,callback){
    axios.post( BASE_URL + 'coupon/list', param)
    .then(function (response) {
      callback(response)
    })
    .catch(function (error) {
    });
  },
  /**
   * 券码批量生成
   */
  batchGenerateCouponList(param,callback){
    axios.post( BASE_URL + 'coupon/batch_generate', param)
    .then(function (response) {
      callback(response)
    })
    .catch(function (error) {
    });
  },
  /**
   * 券码批量分发
   */
  batchDistributeCoupon(param,callback){
    axios.post( BASE_URL + 'coupon/batch_distribute', param)
    .then(function (response) {
      callback(response)
    })
    .catch(function (error) {
    });
  },
  /**
   * 券码导出
   */
  exportCoupon(param,callback){
    window.location.href = BASE_URL + 'coupon/export?token='+util.getToken()+"&"+param
    // axios.get( BASE_URL + 'coupon/export', {params: param})
    // .then(function (response) {
    //   callback(response)
    // })
    // .catch(function (error) {
    // });
  },
  /**
   * 商户券码统计
   */
  statCoupon(param,callback){
    axios.post( BASE_URL + 'coupon/coupon_stat', param)
    .then(function (response) {
      callback(response)
    })
    .catch(function (error) {
    });
  },
}

export default ajaxObj