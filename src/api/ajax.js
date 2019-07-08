/* 
一个能发送ajax请求的函数
1. 统一处理请求异常
2. 异步请求成功的数据不是response, 而是response.data
3. 对post请求参数进行ulencode处理, 而不使用默认的json方式(后台接口不支持)
4. 配置请求超时的时间
*/

import axios from 'axios'
// const qs = require('qs')
import qs from 'qs'

import store from '../vuex/store'
import router from '../router'

// 配置最大时间
axios.defaults.timeout = 20000

// 请求拦截器
axios.interceptors.request.use((config) => {

  const {method, data} = config  
  // 因为后台接收数据的原因，在这里处理post请求
  if (method.toLowerCase()==='post' && data && typeof data==='object') {
    config.data = qs.stringify(data) // {name: 'tom', pwd: '123'} ==> name=tom&pwd=123
  }

  // 携带浏览器的token
  const token = localStorage.getItem('token_key')
  if (token) {
    config.headers.Authorization = 'token ' + token
  }

  return config;
});


// 响应拦截器
axios.interceptors.response.use(response => {
  // 返回data数据
  return response.data
}, error => {// 请求异常

  const status = error.response.status
  const msg = error.message
  if (status === 401) { // 未授权
    // 退出登录
    store.dispatch('logout')
    router.replace('/login')
    alert(error.response.data.message)
  } else if (status === 404) {
    alert('请求的资源不存在')
  } else {
    alert('请求异常: ' + msg)
  }
  return new Promise(() => {})  // 中断promise链
})

export default axios
