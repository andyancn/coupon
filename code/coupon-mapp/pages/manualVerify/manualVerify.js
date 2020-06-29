//logs.js
import apiUrl from '../../utils/api.js'
import { confirm, showToast, formatTime, requestData } from '../../utils/util.js'

Page({
  data: {
    type:1, //1为手动输入，2为不可修改
    coupon:''
  },
  onLoad: function (options) {
    console.log("options:",options);
    if(options.coupon){
      this.setData({
        coupon:options.coupon,
        type: options.type ? options.type : 1
      });
      console.log("coupon:",options.coupon);
    }
  },
  toVerify(){
    const scope = this,
          user = wx.getStorageSync('user'),
          token = wx.getStorageSync('token');
    const param = {
      coupon: this.data.coupon,
      writeOffAccount: user.account
    };
    if(param.coupon == ''){
      showToast({
        title:'请输入券码'
      });
      return;
    }
    requestData({
      url:apiUrl.writeoff+ '?token=' + token,
      data: param,
      success(res){
        if(res.code == 200){
          confirm({
            content: "卡券核销成功",
            success(){
              wx.navigateBack();
            }
          });
        }else{
          confirm({
            content: res.message || "卡券核销失败"
          });
        }
      }
    })
  },
  bindCouponChange(e){
    const coupon = e.detail.value;
    this.setData({
      coupon:coupon
    })
  }
})
