/**
 * 场站数据相关请求模块
 */
import request from '@/utils/request'
//序列化
import qs from 'qs'

// 获取场站数据
export const getLocationList = params => {
    return request({
        method: 'get',
        url: '/vision/location',
        params: params
    })
}

// 获取指定场站
export const getLocationById = id => {
    return request({
        method: 'get',
        url: `/vision/location/${id}`,
    })
}

//添加一条场站数据
export const addLocationData = params => {
    return request({
        method: 'post',
        url: '/vision/location',
        params: params
    })
}

// 更新场站
export const updateLocationData = (params) => {
    return request({
        method: 'put',
        url: '/vision/location',
        params: params

    })
}

// 删除指定的一条场站
export const deleteLocationData = id => {
    return request({
        method: 'delete',
        url: `/vision/location/${id}`,
    })
}

// 获取场站数量
export const getLocationCount = () => {
    return request({
        method: 'get',
        url: '/vision/location/count'
    })
}

// 获取所有场站
export const getLocationOptions = () => {
    return request({
        method: 'get',
        url: '/vision/location/options'
    })
}
