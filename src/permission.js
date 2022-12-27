import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/auth-redirect', '/bind', '/register']

router.beforeEach((to, from, next) => {  //一直会拦截
  console.log('进入路由拦截')
  NProgress.start()   //进度条插件
  if (getToken()) {
    /* has token*/
    console.log('路由拦截有token')
    if (to.path === '/login') {
      next({ path: '/' })  //有令牌时登录页变首页
      NProgress.done()
    } else {
      if (store.getters.roles.length === 0) {
        // 判断当前用户是否已拉取完user_info信息
        console.log('路由拦截拉取user_info')
        store.dispatch('GetInfo').then(res => {
          // 拉取user_info
          const roles = res.roles
          console.log('路由拦截根据roles权限生成可访问的路由表，roles：' + roles)
          store.dispatch('GenerateRoutes', { roles }).then(accessRoutes => {
            console.log("accessRoutes：" + accessRoutes)
          // 测试 默认静态页面
          // store.dispatch('permission/generateRoutes', { roles }).then(accessRoutes => {
            // 根据roles权限生成可访问的路由表
            accessRoutes.forEach(r => {
              router.addRoute(r)
              console.log(r)
            })
            // router.addRoutes(accessRoutes) // 动态添加可访问路由表
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
          })
        })
          .catch(err => {
            store.dispatch('FedLogOut').then(() => {
              Message.error(err)
              next({ path: '/' })
            })
          })
      } else {
        next()
        // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
        // if (hasPermission(store.getters.roles, to.meta.roles)) {
        //   next()
        // } else {
        //   next({ path: '/401', replace: true, query: { noGoBack: true }})
        // }
        // 可删 ↑
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      // next() //放行
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
