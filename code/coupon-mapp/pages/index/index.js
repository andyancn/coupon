//index.js
//获取应用实例
const app = getApp();

import apiUrl from '../../utils/api.js'
import { showToast, formatTime, requestData } from '../../utils/util.js'

Page({
  data: {
    loginFlag: true,
    user:{
      account:'',
      password:'',
    },
    isShowpw:false,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    let token = wx.getStorageSync('token'),
        tokenEndTime = wx.getStorageSync('tokenEndTime'),
        user = wx.getStorageSync('user'),
        nowTime = new Date();
    if(token && user){
      if(new Date(tokenEndTime).getTime() > nowTime.getTime() + 20*60*1000){
        console.log("token有效期大于20分钟");
      }else{
        this.setData({
          user:user 
        });
        this.login();
      }
    }else{
      this.setData({
        loginFlag:false
      })
    }
  },
  login() {
    const scope = this;
    const param = this.data.user;
    if(param.account == '' || param.password == ''){
      showToast({
        title:'账号密码不能为空'
      });
      return;
    }
    requestData({
      url:apiUrl.login,
      data: param,
      success(res){
        if(res.code == 200){
          wx.setStorageSync('token', res.data.token);
          wx.setStorageSync('tokenEndTime', res.data.tokenEndTime);  
          const user = {
            account:res.data.account,
            password:res.data.password,
          }
          wx.setStorageSync('user',user);
          scope.setData({
            loginFlag:true
          })
        }else{
          showToast({
            title: res.message || '登录失败，账号密码错误'
          });
          scope.setData({
            loginFlag:false
          })
        }
      },
      fail(){
        scope.setData({
          loginFlag:false
        })
      }
    })
  },
  getRecode(){
    wx.reLaunch({
      url: "/pages/list/list"
    })
  },
  scan(){
    wx.scanCode({
      success(res) {
        console.log(res.result);
        wx.navigateTo({
          url: "/pages/manualVerify/manualVerify?type=2&coupon=" + res.result
        })
      }
    })
  },
  toManualVerify(){
    wx.navigateTo({
      url: "/pages/manualVerify/manualVerify"
    })
  },
  /**
   * 输入账号
   */
  bindUserNameChange(e){
    const account = e.detail.value;
    this.setData({
      ['user.account']:account
    })
  },
  /**
   * 输入密码
   */
  bindPwdChange(e){
    const password = e.detail.value;
    this.setData({
      ['user.password']:password
    })
  },
  /**
   * 明文显示密码
   */
  showPW(){
    this.setData({
      isShowpw: !this.data.isShowpw
    });
  },
  getUserInfo(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
