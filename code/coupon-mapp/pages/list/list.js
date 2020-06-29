var app = getApp()
import apiUrl from '../../utils/api.js'
import { formatDate, requestData, confirm } from '../../utils/util.js'

Page({
  data: {
    //正在初始化
    isInit: 1,
    currentTab:1,
    list:null,
    //页码
    PageNo: 1,
    //页大小
    PageSize: 20,
    //正在加载
    isLoad: false,
    //已到最后一页
    isLast: false,
    startDate: formatDate(new Date(), 'yyyy-MM-dd'),//默认起始时间  
    endDate: formatDate(new Date(), 'yyyy-MM-dd'),//默认结束时间
    totalPrice:0,
  },
  onLoad: function () {
    this.setData({
      isLoad: true
    });
    this.list(1);
    this.getTotalPrice();
  },
  /**
   * 开始日期选择
   * @param {Event} event
   */
  handleStartDateChange (event) {
    this.setData({
      startDate: event.detail.value
    });
  },
  /**
   * 结束日期选择
   * @param {Event} event
   */
  handleEndDateChange (event) {
    this.setData({
      endDate: event.detail.value
    });
  },
  refresh(){
    this.setData({
      isLoad: true,
      PageNo: 1
    },() => {
      this.list(1);
      this.getTotalPrice();
    }) 
  },
  onPullDownRefresh:function(){
    this.refresh();
    wx.stopPullDownRefresh()
  },
  onReachBottom:function(){
    this.loadmore()
  },
   loadmore: function(e) {
    if (this.data.isLoad == 1 || this.data.isLast) {
      return;
    }
    this.setData({
      isLoad: 1,
      PageNo: this.data.PageNo + 1
    },() => {
      this.list();
    }) 
  },
  list(type){
    const scope = this,
          token = wx.getStorageSync('token'),
          user = wx.getStorageSync('user');
    const param = {
      "pageIndex":this.data.PageNo,
      "pageSize":20,
      "coupon":"",
      "couponType":"",
      "businessCode":"",
      "channelCode":"", 
      "writeOffAccount":user.account,
      "status":2,
      "startCreateTime":"",
      "endCreateTime":"",
      "startWriteOffTime":this.data.startDate,
      "endWriteOffTime":this.data.endDate + " 23:59:59"
    }
    requestData({
      url:apiUrl.list+ '?token=' + token,
      data: param,
      showLoading:type === 1 ? true:false,
      success(res){
        console.log(res);
        if(res.code == 200){
          let data = res.data.results;
          if(data && data.length > 0){
            scope.setData({
              ['list[' + (scope.data.PageNo-1) + ']']: data
            });
            //若当前订单条数少于默认的PageSize的值，则表示没有更多订单
            if(data.length < scope.data.PageSize){
              scope.setData({
                isLast: true,
              });
            }
          }else{
            if(scope.data.PageNo == 1){
              scope.setData({
                list: []
              })
            }
            scope.setData({
              isLast: true,
            })
          }
        }else if(res.code == 401){
          wx.reLaunch({
            url: "/pages/index/index"
          })
        }else{
          if(type === 1){
            confirm({
              content: res.message || "卡券核销记录获取失败"
            });
          }
        }
      },
      complete(){
        if(type !== 1){
          wx.stopPullDownRefresh();
        }else{
          wx.hideToast();
        }
        scope.setData({
          isLoad:false,
        })
      }
    })
  },
  getTotalPrice(){
    const scope = this,
          token = wx.getStorageSync('token'),
          user = wx.getStorageSync('user');
    const param = {
      "pageIndex":1,
      "pageSize":20,
      "coupon":"",
      "couponType":"",
      "businessCode":"",
      "channelCode":"", 
      "writeOffAccount":user.account,
      "status":2,
      "startCreateTime":"",
      "endCreateTime":"",
      "startWriteOffTime":this.data.startDate,
      "endWriteOffTime": this.data.endDate != '' ? (this.data.endDate.indexOf(' 23:59:59') > -1 ? this.data.endDate : this.data.endDate + " 23:59:59") : ''
    }
    requestData({
      url:apiUrl.getTotalPrice+ '?token=' + token,
      data: param,
      showLoading:false,
      success(res){
        console.log(res);
        if(res.code == 200){
          scope.setData({
            totalPrice:res.data.sumPrice || 0
          });
        }else{
          confirm({
            content: res.message || "卡券核销总价获取失败"
          });
        }
      }
    })
  },
  routerTo(e){
    let url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url:url
    });
  },
  toIndex(){
    wx.reLaunch({
      url: "/pages/index/index"
    })
  },
})
