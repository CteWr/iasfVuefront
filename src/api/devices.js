/**
 * 设备相关请求模块
 */
import request from '@/utils/request'
//序列化
import qs from 'qs'

// 获取所有设备选项信息
export const getDevices = (params) => {
    return request({
        method: 'GET',
        url: '/common/device',
        params: params
    })
}
//获取苏47-1H的设备信息
export const getDevicesForFirst = () => {
    return request({
        method: 'GET',
        url: '/common/first/device'
    })
}
//获取第一处理厂的设备信息
export const getDevicesForIndex = () => {
    return request({
        method: 'GET',
        url: '/common/index/device'
    })
}

// 获取设备数据
export const getDeviceList = params => {
    return request({
        method: 'get',
        url: '/vision/device',
        params: params
    })
}

//添加一台设备
export const addDeviceData = params => {
    return request({
        method: 'post',
        url: '/vision/device',
        params: params
    })
}

// 删除指定的一台设备
export const deleteDeviceData = id => {
    return request({
        method: 'delete',
        url: `/vision/device/${id}`,
    })
}

// 更新指定的一台设备
export const updateDeviceData = (params) => {
    return request({
        method: 'put',
        url: '/vision/devices',
        params: params

    })
}
// 获取指定的一台设备
export const getDeviceById = id => {
    return request({
        method: 'get',
        url: `/vision/device/${id}`,
    })
}

// 获取设备位置
export const getFactoryDevice = (params) => {
    return request({
        method: 'get',
        url: '/factory/devices',
        params: params
    })
}

// 获取设备数量
export const getDeviceCount = () => {
    return request({
        method: 'get',
        url: '/vision/device/count'
    })
}