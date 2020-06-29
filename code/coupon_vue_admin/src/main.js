import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import util from "./utils/util.js"
import ajax from "./utils/request.config.js"
import dataJs from "./utils/data.js"
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
import './assets/css/icon.css';
import './assets/css/main.css';
import './components/common/directives';


Vue.config.productionTip = false;

Vue.use(ElementUI, {
    size: 'medium'
});

Vue.prototype.$axios = axios;
Vue.prototype.$ajax = ajax;
Vue.prototype.dataJs = dataJs;
Vue.prototype.util = util;

axios.interceptors.request.use(
  config => {
    config.headers['Content-Type'] = 'application/json;charset=utf-8';
    config.headers['token'] = util.getToken();
    return config;
  },
  err => {
    return Promise.reject(err)
  }
)

axios.interceptors.response.use(function (response) {
    if (response.status == 200) {
        let resp = response.data;
        if(resp.code == 200){
          return resp
        }else if(resp.code == 401){
          //401是说明token过期，所以要跳转到登录页面，但必须把之前登录的信息清空掉。
          util.removeToken();
          util.removeUserName();
          router.push({ path: '/login' })
          return
        }else {
          ElementUI.Notification.error({
            title: '错误',
            message: resp.message
          });
          return Promise.reject(error)
        }
    } else {
        ElementUI.Notification.error({
            title: '错误',
            message: '获取接口异常，稍后请重试~'
        });
         return Promise.reject(error)
    }
}, function (error) {
  console.log(error);
    ElementUI.Notification.error({
        title: '错误',
        message: "获取接口异常，稍后请重试~"
    });
    return Promise.reject(error)
})

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('MS_TOKEN');
    if (!token && to.path !== '/login') {
        next('/login');
    } else {
        next();
    }
})


new Vue({
    router,
    render: h => h(App)
}).$mount('#app')