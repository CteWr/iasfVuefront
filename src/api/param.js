/**
 * 参数数据相关请求模块
 */
import request from '@/utils/request'
//序列化
import qs from 'qs'

// 获取参数数据
export const getParamList = params => {
    return request({
        method: 'get',
        url: '/vision/param',
        params: params
    })
}

// 获取指定参数
export const getParamById = id => {
    return request({
        method: 'get',
        url: `/vision/param/${id}`,
    })
}

// 删除指定的一条参数设置
export const deleteParamData = id => {
    return request({
        method: 'delete',
        url: `/vision/param/${id}`,
    })
}

//添加一条参数设置数据
export const addParamData = params => {
    return request({
        method: 'post',
        url: '/vision/param',
        params: params
    })
}

// 更新参数
export const updateParamData = (params) => {
    return request({
        method: 'put',
        url: '/vision/param',
        params: params
    })
}
