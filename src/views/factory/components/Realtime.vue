<template>
  <div class="app-container">
    <div class="block">
      <div style="width:60%;float:left;position:relative">
        <el-image class="image" :src="loadImage()" fit="contain" @load="showLabel"></el-image>
        <div class="pannel" v-for="item in devices" :key="item.id">
          <div class="note" :style="item.style" v-on:click="setDevice(item.id)" slot="reference" trigger="click" :title="item.deviceId"></div>
        </div>
      </div>
      <div style="width:40%;float:left;padding-left:20px">
        <el-card>
          <!-- <div style="margin-bottom:20px">实时数据 <span>{{nowDate}}</span></div> -->
          <div slot="header" class="clearfix">
            <span>实时数据</span>
            <el-button style="float: right; padding: 3px 0" type="text" size="small">{{nowDate}}</el-button>
          </div>
          <table border="0" cellspacing="1" cellpadding="0" style="width:100%" class="myTable">
            <tr>
              <th>类别</th>
              <th>值</th>
            </tr>
            <tr>
              <td>设备编号</td>
              <td>{{visionData.deviceId}}</td>
            </tr>
            <tr>
              <td>0°值</td>
              <td>{{visionData.zeroWallThickness}}</td>
            </tr>
            <tr>
              <td>90°值</td>
              <td>{{visionData.nintyWallThickness}}</td>
            </tr>
            <tr>
              <td>180°值</td>
              <td>{{visionData.oneEightZeroWallThickness}}</td>
            </tr>
            <tr>
              <td>270°值</td>
              <td>{{visionData.twoSevenZeroWallThickness}}</td>
            </tr>
            <tr>
              <td>设备地址</td>
              <td>{{visionData.address}}</td>
            </tr>
            <tr>
              <td>物联网卡号</td>
              <td>{{visionData.iotCardId}}</td>
            </tr>
          </table>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { getFactoryDevice } from '@/api/devices'
import { getVisionByDevice } from '@/api/data'

export default {
  name: 'Realtime',
  data() {
    return {
      timer: null,
      nowDate: '',
      location: 1,
      devices: null,
      curDevice: null,
      visionData: {
        id: null,
        deviceId: null,
        location: null,
        zeroWallThickness: null,
        nintyWallThickness: null,
        oneEightZeroWallThickness: null,
        twoSevenZeroWallThickness: null,
        voltage: null,
        collectTime: null
      }
    }
  },
  created() {
    this.init()
    this.timer = setInterval(() => {
      setTimeout(() => {
        this.getVisionData()
      }, 0)
    }, 10000)
  },
  methods: {
    init() {
      const curPath = this.$route.path
      const m = curPath.match(/location\/(\d+)/)
      if (m.length > 1) {
        this.location = m[1]
      }
    },
    loadImage() {
      if (this.location === '1') {
        return require('@/assets/factory1.jpg')
      }
      if (this.location === '2') {
        return require('@/assets/factory2.jpg')
      }
      if (this.location === '3') {
        return require('@/assets/factory3.jpg')
      }
    },
    showLabel() {
      getFactoryDevice({ location: this.location }).then(res => {
        this.devices = res.data.data
      })
    },
    setDevice(id) {
      console.log(id)
      this.timer = null
      this.curDevice = id
      this.getVisionData()
    },
    getVisionData() {
      if (this.curDevice) {
        getVisionByDevice(this.curDevice).then(res => {
          this.visionData = res.data.data
        })
        this.formatDate()
      }
    },
    formatDate() {
      let date = new Date();
      let year = date.getFullYear(); // 年
      let month = date.getMonth() + 1; // 月
      let day = date.getDate(); // 日
      let hour = date.getHours(); // 时
      hour = hour < 10 ? "0" + hour : hour; // 如果只有一位，则前面补零
      let minute = date.getMinutes(); // 分
      minute = minute < 10 ? "0" + minute : minute; // 如果只有一位，则前面补零
      let second = date.getSeconds(); // 秒
      second = second < 10 ? "0" + second : second; // 如果只有一位，则前面补零
      this.nowDate = `最近更新：${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }
  }
}
</script>

<style>
.image {
  width: 100%;
  height: 100%;
  /* position: absolute; */
}

.pannel {
}

.note {
  width: 14px;
  height: 14px;
  background-color: green;
  border-radius: 50%;
  position: absolute;
  /* top: 78%;
  left: 25%; */
  cursor: pointer;
  z-index: 100;
}

.time {
  font-size: 13px;
  color: #999;
}
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}

.myTable {
    border:1px solid #EBEEF5;
    text-align:center;
    border-collapse: collapse;
    font-size: 14px;
    color: #606266;
}

.myTable th {
    border:1px solid #EBEEF5;
    height: 48px;
    color:#909399;
    font-weight:bold;
}

.myTable td {
    border:1px solid #EBEEF5;
    height: 48px;
    line-height: 23px;
}
</style>
