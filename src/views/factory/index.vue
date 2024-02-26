<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="实时数据" name="realtime">
        <realtime />
      </el-tab-pane>
      <el-tab-pane label="历史数据" name="history" lazy>
        <vision />
      </el-tab-pane>
      <el-tab-pane label="趋势预测" name="display" lazy>
        <display />
      </el-tab-pane>
      <el-tab-pane label="腐蚀情况" name="corrosion" lazy>
        <corrosion />
      </el-tab-pane>
      <el-tab-pane label="报警信息" name="alarm" lazy>
        <alarm />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import Realtime from './components/Realtime'
import Vision from './components/Vision'
import Display from './components/Display'
import Corrosion from './components/Corrosion'
import Alarm from './components/Alarm'

export default {
  name: 'Factory',
  components: { Realtime, Vision, Display, Corrosion, Alarm },
  data() {
    return {
      activeName: 'realtime'
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    }
  }
};
</script>