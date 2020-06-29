import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
      {
        path: '/',
        redirect: '/coupon'
      }, 
      {
        path: '/',
        component: () => import(/* webpackChunkName: "home" */'../components/common/Home.vue') ,
        meta: { title: '自述文件' },
        children:[
           {
            // 商户管理
            path: '/merchant',
            component: () => import(/* webpackChunkName: "Merchant" */'../components/page/Merchant.vue'),
            meta: { title: '商户管理' }
          }, {
              // 渠道管理
              path: '/channel',
              name: 'channel',
              component: () => import(/* webpackChunkName: "Channel" */'../components/page/Channel.vue'),
              meta: { title: '渠道管理' }
          }, {
              // 券码管理
              path: '/coupon',
              name: 'coupon',
              component: () => import(/* webpackChunkName: "Coupon" */'../components/page/Coupon.vue'),
              meta: { title: '券码管理' }
          }, {
            // 券码管理
              path: '/couponDetail',
              component: () => import(/* webpackChunkName: "CouponDetail" */'../components/page/CouponDetail.vue'),
              meta: { title: '商户券码列表' }
          }, {
              // 券码种类管理
              path: '/coupon-kind',
              component: () => import(/* webpackChunkName: "CouponKind" */'../components/page/CouponKind.vue'),
              meta: { title: '券码种类管理' }
          }, {
              // 账号管理
              path: '/account',
              component: () => import(/* webpackChunkName: "Account" */'../components/page/Account.vue'),
              meta: { title: '账号管理' }
          }, {
              path: '/404',
              component: () => import(/* webpackChunkName: "common" */'../components/page/404.vue'),
              meta: { title: '404' }
          }, {
              path: '/403',
              component: () => import(/* webpackChunkName: "common" */'../components/page/403.vue'),
              meta: { title: '403' }
          }
        ]
      }, 
      {
        path: '/login',
        component: resolve => require(['../components/page/Login.vue'], resolve)
      },
      {
        path: '*',
        redirect: '/404'
      }
    ]
})
