import request from '@/utils/request'
import qs from 'qs'

export const login = (data) => {
  return request({
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
    url: '/login',
    data: qs.stringify(data)
  })
}

export function getInfo(token) {
  return request({
    url: '/profile',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

// 获取左侧导航栏
export const getMenu = () => {
  return request({
      method: 'GET',
      url: '/menu'
  })
}

// 获取用户信息
export const getUserProfile = () => {
  return request({
    method: 'GET',
    url: '/profile'
  })
}

// 获取用户数据
export const getUserList = (params) => {
  return request({
      method: 'get',
      url: '/sys/user',
      params: params
  })
}

//添加一条用户数据
export const addUserData = (params) => {
  return request({
      method: 'post',
      url: '/sys/user',
      params: params
  })
}

//删除一条用户数据
export const deleteUserData = id => {
  return request({
      method: 'delete',
      url: `/sys/user/${id}`,
  })
}

//给用户分配设备
export const setDeviceData = (params) => {
  return request({
      method: 'put',
      url: `/vision/device?uid=${params.uid}&devices=${params.devices}`,
  })
}

//修改用户密码
export const setNewPassword = params => {
  return request({
      method: 'put',
      url: '/sys/user/password',
      params: params
  })
}

// 获取所用用户数量
export const getUserCount = () => {
  return request({
    method: 'get',
    url: '/sys/user/count'
  })
}
