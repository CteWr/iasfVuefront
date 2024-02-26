/**
 * 监测数据相关请求模块
 */
import request from '@/utils/request'
//序列化
import qs from 'qs'

// 获取监测数据
export const getVisionList = params => {
    return request({
        method: 'get',
        url: '/vision/data',
        params: params
    })
}
// 获取苏47-1H监测数据
export const getFirstVisionList = params => {
    return request({
        method: 'get',
        url: '/vision/first/data',
        params: params
    })
}

// 获取监测柱状图数据
export const getVisionBar = params => {
    return request({
        method: 'get',
        url: '/vision/display',
        params: params
    })
}

// 删除指定的一条监测数据
export const deleteVisionData = id => {
    return request({
        method: 'delete',
        url: `/vision/data/${id}`,
    })
}

//获取一条指定的监测数据
export const getVisionByDeviceId = id => {
    return request({
        method: 'get',
        url: `/vision/data/${id}`,
    })
}

//获取最新一条指定的监测数据
export const getVisionByDevice = id => {
    return request({
        method: 'get',
        url: `/vision/data/device/${id}`,
    })
}

//添加一条监测数据
export const addVisionData = params => {
    return request({
        method: 'post',
        url: '/vision/data',
        params: params
    })
}