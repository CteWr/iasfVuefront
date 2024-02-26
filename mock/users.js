const Mock = require('mockjs')

const data = Mock.mock({
  'items|5': [{
    id: '@id',
    'username': '@cname',
    'status|1': ['正常', '下线'],
    role: '系统管理员',
    devices: '设备1',
    create_time: '@datetime',
    pageviews: '@integer(300, 5000)'
  }]
})

module.exports = [
  {
    url: '/vue-admin-template/user/list',
    type: 'get',
    response: config => {
      const items = data.items
      return {
        code: 20000,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  }
]
