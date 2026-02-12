<template>
  <PanelHead :route="route" />
  <div class="container">
    <div class="top">
      <div class="left">
        <div class="left-top">
          <el-image
            class="avatar"
            :src="dashBoardData.user.user_img"
          ></el-image>
          <span class="text1">{{ dashBoardData.user.user_name }}</span>
        </div>
        <hr style="border: none; border-top: 1px solid #aaa" />
        <div class="left-bottom">
          <span class="text2"
            >当前权限: {{ dashBoardData.user.permission }}</span
          >
          <span class="text2">登录的ip: {{ dashBoardData.user.ip }}</span>
        </div>
      </div>
      <div class="right">
        <div class="grid-2x2">
            <div class="grid-item">
                <el-image class="image" src="/dzf.png" style="background-color: red;"/>
                <span>
                    <span class="text1">{{orderCounts.pending}}</span>
                    <span class="text2">待支付</span>
                </span>
            </div>
            <div class="grid-item">
                <el-image class="image" src="/dfw.png" style="background-color: blueviolet;"/>
                <span>
                    <span class="text1">{{orderCounts.service}}</span>
                    <span class="text2">待服务</span>
                </span>
            </div>
            <div class="grid-item">
                <el-image class="image" src="/ywc.png" style="background-color: blue;"/>
                <span>
                    <span class="text1">{{orderCounts.completed}}</span>
                    <span class="text2">已完成</span>
                </span>
            </div>
            <div class="grid-item">
                <el-image class="image" src="/yqx.png"  style="background-color: green;"/>
                <span>
                    <span class="text1">{{orderCounts.cancelled}}</span>
                    <span class="text2">已取消</span>
                </span>
            </div>
        </div>
      </div>
    </div>
    <div class="bottom">
        <div ref="chartRef" class="chart"></div>
        <div v-if="!hasData" class="empty-tip">暂无订单数据</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted, watch } from "vue";
import { dashBoard } from'@/api';
import { useRouter, useRoute } from "vue-router";
import * as echarts from 'echarts'

const router = useRouter();
const route = useRoute();
// 用计算属性安全访问各状态数量
const orderCounts = computed(() => {
  const types = dashBoardData.types || []
  return {
    pending: types[0]?.num ?? 0,    // 待支付
    service: types[1]?.num ?? 0,     // 待服务
    completed: types[2]?.num ?? 0,   // 已完成
    cancelled: types[3]?.num ?? 0    // 已取消
  }
})
onMounted(() => {
  dashBoard().then(({ data }) => {
    if (data.code === 10000) {
      const { typeList, types, user } = data.data;
      // 赋值
      dashBoardData.typeList = typeList || [];
      dashBoardData.types = types || [];
      dashBoardData.user = user || {};
    }
  });
  initChart()
});
//接收信息
const dashBoardData = reactive({
  typeList: [],
  types: [],
  user: {},
});
//画图

const chartRef = ref(null)
let chart = null
const hasData = ref(false)
// 初始化图表
const initChart = () => {
  if (!chartRef.value) return
  
  chart?.dispose()
  chart = echarts.init(chartRef.value)
  
  const defaultOption = {
    title: {
      text: '近5日订单趋势',
      left: 'center',
      top: 10,
      textStyle: {
        fontSize: 16,
        fontWeight: 'normal',
        color: '#333'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '10%',
      right: '10%',
      bottom: '15%',
      top: '20%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: [],
      axisLine: {
        lineStyle: {
          color: '#999'
        }
      },
      axisLabel: {
        fontSize: 12
      }
    },
    yAxis: {
      type: 'value',
      name: '订单数',
      nameTextStyle: {
        fontSize: 12,
        color: '#666'
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#eee'
        }
      }
    },
    // ✅ 正确写法：只定义一个 series
    series: [
      {
        name: '订单数量',
        type: 'line',
        data: [],
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          width: 3,
          color: '#1989fa'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(25, 137, 250, 0.3)' },
            { offset: 1, color: 'rgba(25, 137, 250, 0.01)' }
          ])
        },
        // ✅ 显示数字标签
        label: {
          show: true,
          position: 'top',
          color: '#666',
          fontSize: 12
        }
      }
    ]
  }
  
  chart.setOption(defaultOption)
  window.addEventListener('resize', handleResize)
}

// 更新图表数据
const updateChartData = () => {
  if (!chart) {
    initChart()
  }
  
  // ✅ 直接用 dashBoardData.typeList
  const typeList = dashBoardData.typeList || []
  console.log('原始 typeList:', typeList)
  
  if (!typeList.length) {
    console.log('typeList 为空')
    return
  }
  
  const dates = typeList.map(item => {
    const [, month, day] = item.date.match(/(\d{4})-(\d{2})-(\d{2})/) || []
    return `${month}/${day}`
  })
  
  const orderCounts = typeList.map(item => {
    console.log(`日期 ${item.date}: order_sum = ${item.order_sum}, 类型: ${typeof item.order_sum}`)
    return item.order_sum
  })
  
  hasData.value = orderCounts.some(count => count > 0)
  console.log('是否有数据:', hasData.value, '订单数组:', orderCounts)
  
  chart?.setOption({
    xAxis: { data: dates },
    series: [{ data: orderCounts }]
  })
}

// 监听 dashBoardData.typeList 的变化
watch(() => dashBoardData.typeList, () => {
  if (dashBoardData.typeList?.length) {
    updateChartData()
  }
}, { deep: true, immediate: true })

const handleResize = () => {
  chart?.resize()
}

</script>

<style lang="less" scoped>
.container {
  height: 90%;
  width: 100%;

  .top {
    height: 40%;
    display: flex;
    gap: 20px;
    padding: 10px;

    .left {
      flex: 1;
      background-color: white;
      border-radius: 10px;
      box-shadow: 0 3px 5px gray;
      display: flex;
      flex-direction: column;

      .left-top {
        height: 70%;
        display: flex;
        align-items: center;
        padding-left: 40px;

        .avatar {
          width: 150px;
          height: 150px;
          margin-right: 20px;
        }
      }

      .left-bottom {
        height: 30%;
        padding-left: 40px;

        span {
          display: block;
          padding: 5px;
        }
      }
    }

    .right {
        flex: 1;
        background-color: white;
        border-radius: 10px;
        box-shadow: 0 3px 5px gray;
        display: flex;
        align-items: center;
        width: 100%;
        justify-content: space-around;
        align-items: center;
        height: 100%;

        .grid-2x2 {
            display: grid;
            grid-template-columns: 1fr 1fr;  /* 两列，等宽 */
            grid-template-rows: 1fr 1fr;     /* 两行，等高 */
            gap: 20px;                       /* 间距 */
            width: 80%;                      /* 根据需求调整 */
            height: 80%;
            place-items: center;            /* 水平垂直居中 */
        }

        .grid-item {
            display: flex;
            flex-direction:row;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
        }
    }
}

  .bottom {
    height: 60%;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 3px 5px gray;
    margin-top: 20px;
  }
}
.text1 {
  color: black;
  font-size: 30px;
  font-weight: 500;
  display: block;
}
.text2 {
  color: rgb(79, 79, 79);
  font-size: 15px;
}
.image {
    width: 80px;
    height: 80px;
    display: inline;
    padding: 5px;
    margin-right: 10px;
}
.chart {
  width: 100%;
  height: 100%;
  min-height: 350px;
}

.empty-tip {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #999;
  font-size: 14px;
}
</style>
