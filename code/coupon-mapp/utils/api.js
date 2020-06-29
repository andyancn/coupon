/**
 * api.js
 * @date    2019-05-18 17:47:41
 * @version 1.0.0
 */

//  let baseUrl = "https://d.sacs.com.cn/";
 let baseUrl = "http://localhost:40011/";

 module.exports = {
  login: baseUrl + "coupon/login",
  writeoff: baseUrl + "coupon/coupon/writeoff",
  list: baseUrl + "coupon/coupon/list",
  getTotalPrice: baseUrl + "coupon/coupon/totalPrice"
 }