/**
 * 参数数据相关请求模块
 */
import request from '@/utils/request'
//序列化
import qs from 'qs'

// 获取参数数据
export const getCorrosionList = params => {
    return request({
        method: 'get',
        url: '/vision/corrosion',
        params: params
    })
}


// 删除指定的一条参数设置
export const deleteCorrosionData = id => {
    return request({
        method: 'delete',
        url: `/vision/corrosion/${id}`,
    })
}
