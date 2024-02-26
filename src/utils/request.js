import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // baseURL : "http://localhost:8888",
  // withCredentials: true, // send cookies when cross-domain requests
  headers: {
    'Content-Type': "application/json; charset=utf-8"
  },
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    config.headers['Authorization'] = localStorage.getItem("token");
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    if (res.code === 200) {
      return response
    } else {
      Message.error(!res.message ? '系统异常' : res.message);
      return Promise.reject(new Error(res.message || 'Error'))
    }
  },
  error => {
    console.log('err' + error) // for debug
    if (error.response.data) {
      error.message = error.response.data.message
    }
    if (error.response.status === 401) {
      router.push("/login")
    }
    Message.error(error.message, { duration: 3000 });
    return Promise.reject(error)
  }
)

export default service
