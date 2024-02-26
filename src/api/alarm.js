/**
 * 预警数据相关请求模块
 */
import request from '@/utils/request'
//序列化
import qs from 'qs'

// 获取预警数据
export const getAlarmList = params => {
    return request({
        method: 'get',
        url: '/vision/alarm',
        params: params
    })
}


//添加一条预警设置数据
export const addAlarmData = params => {
    return request({
        method: 'post',
        url: '/vision/alarm',
        params: params
    })
}

// 删除指定的一条预警设置
export const deleteAlarmData = id => {
    return request({
        method: 'delete',
        url: `/vision/alarm/${id}`,
    })
}

// 获取报警数量
export const getAlarmCount = () => {
    return request({
        method: 'get',
        url: '/vision/alarm/count'
    })
}
