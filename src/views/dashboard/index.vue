<template>
  <div class="dashboard-container">
    <!-- <div class="dashboard-text">登录用户: {{ name }}</div> -->
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="linkLocation">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="example" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              课题数
            </div>
            <count-to :start-val="0" :end-val="locationCount" :duration="1000" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="linkDevice">
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="star" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              实验数
            </div>
            <count-to :start-val="0" :end-val="deviceCount" :duration="1000" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="linkUser">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="user" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">

            </div>
            <count-to :start-val="0" :end-val="userCount" :duration="1000" class="card-panel-num" />
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="home_content_content">
    <el-row :gutter="20">
      <el-col :span="17">
        <el-card class="box-card">
          <div class="title">
            <h3>硬X射线实验室</h3>
          </div>
          <div class="main-body">
            <p>硬X射线实验室一直致力于</p >
            <p>实验室主任为崔艺涛，实验室固定研究人员x人，其中高级工程师x人，教授x人，副教授x人，讲师4人，博士和硕士研究生xx余人。</p >
            <p>实验室在衍射、散射、小角、荧光等领域取得了系列研究成果。</p >

            <p>
              <span class="title-2">实验室主任：</span>
              <span>崔艺涛</span>
            </p >
            <p>
              崔老师个人介绍
            </p >
            <p>
              <span class="title-2">实验室主要成员：</span>
              <span>...</span>
            </p >
          </div>
        </el-card>
      </el-col>
      <el-col :span="7">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <h3>项目情况</h3>
            <el-button style="float: right; padding: 3px 0" type="text">
              查看
            </el-button>
          </div>
          <div class="project-info">
            <div>
              <span class="title">实验室项目：</span>
              <span class="number-total">2</span>
              <span>个</span>
            </div>
            <div>
              <span class="title">在研项目：</span>
              <span class="number-processing">2</span>
              <span>个</span>
            </div>
            <div>
              <span class="title">已结题项目：</span>
              <span class="number-done">0</span>
              <span>个</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getDeviceCount } from '@/api/devices'
import { getUserCount } from '@/api/user'
import { getAlarmCount } from '@/api/alarm'
import { getLocationCount } from '@/api/location'
import CountTo from 'vue-count-to'

export default {
  name: 'Dashboard',
  data() {
    return {
      userCount: 0,
      deviceCount: 0,
      locationCount: 0,
      alarmCount: 0
    }
  },
  created() {
    this.fetchDeviceCount()
    this.fetchUserCount()
    this.fetchLocationCount()
    this.fetchAlarmCount()
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  components: {
    CountTo
  },
  methods: {
    linkDevice() {
      this.$router.push({name: 'Device'})
    },
    linkUser() {
      this.$router.push({name: 'User'})
    },
    linkLocation() {
      this.$router.push({name: 'Location'})
    },
    linkAlarm() {
      this.$router.push({name: 'Alarm'})
    },
    fetchDeviceCount() {
      getDeviceCount().then(response => {
        this.deviceCount = response.data.data.total
      })
    },
    fetchUserCount() {
      getUserCount().then(response => {
        this.userCount = response.data.data.total
      })
    },
    fetchLocationCount() {
      getLocationCount().then(response => {
        this.locationCount = response.data.data.total
      })
    },
    fetchAlarmCount() {
      getAlarmCount().then(response => {
        this.alarmCount = response.data.data.total
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
