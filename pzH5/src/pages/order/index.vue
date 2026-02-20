<template>
  <div class="container">
    
    <div class="header">
      <van-icon
        name="arrow-left"
        @click="goBack"
        class="header-left"
        size="20px"
      />
      我的订单
    </div>
    <van-tabs v-model:active="active" @click-tab="onClickTab">
      <van-tab title="全部" name=""></van-tab>
      <van-tab title="待支付" name="1"></van-tab>
      <van-tab title="待服务" name="2"></van-tab>
      <van-tab title="已完成" name="3"></van-tab>
      <van-tab title="已取消" name="4"></van-tab>
    </van-tabs>
    <div class="order-list">
      <van-row
        justify="space-around"
        v-for="item in order"
        :key="item.out_trade_no"
        @click="goDetail(item)"
      >
        <van-col span="5">
          <van-image
            :src="item.serviceImg"
            radius="5px 5px"
            width="50px"
            height="50px"
          ></van-image>
        </van-col>
        <van-col span="14">
          <div class="text1">{{ item.service_name }}</div>
          <div class="text2">
            <div>{{ item.hospital_name }}</div>
            <div>预约时间：{{ item.starttime }}</div>
          </div>
          <div class="text3">
            <span>{{ item.intro }}</span>
          </div>
        </van-col>
        <van-col
          span="5"
          :style="{ color: colorMap[item.trade_state] }"
          class="text2"
        >
          {{ item.trade_state }}
          <counter :second="item.timer" v-if="item.trade_state === '待支付'" />
        </van-col>
      </van-row>
      <div class="bottom-text">没有更多了</div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance, computed, watch } from "vue";
import { useRouter,useRoute } from "vue-router";
import counter from "@/components/counter.vue";

const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const active = ref("");
const order = ref([]);
//获取订单列表
const onClickTab = (item) => {
  getOrderList(item.name);
};
const getOrderList = async (state) => {
  const { data } = await proxy.$api.orderList({ state });
  data.data.forEach((item) => {
    item.timer = item.order_start_time + 7200000 - Date.now();
  });
  order.value = data.data;
};
onMounted(() => {
  getOrderList("");
});
//订单状态映射
const colorMap = {
  待支付: "#ffa200",
  待服务: "#1da6fd",
  已完成: "#21c521",
};
//跳转详情
const goDetail = (item) => {
  router.push(`/detail?oid=${item.out_trade_no}`);
};
const goBack = () => {
  router.go(-1);
};
// 监听路由参数 active，立即执行一次
watch(() => route.query.active, (newVal) => {
  // 将参数转换为字符串，空值或无参数时显示“全部”（name=""）
  const state = newVal ? String(newVal) : ''
  active.value = state
  getOrderList(state)
}, { immediate: true })
</script>

<style lang="less" scoped>
.container {
  background-color: #f0f0f0;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.header {
  background-color: #fff;
  line-height: 40px;
  text-align: center;
  padding: 10px 0;
  flex-shrink: 0;
  .header-left {
    padding: 10px 0;
    float: left;
  }
}
.van-tabs {
  flex-shrink: 0;
}
.order-list {
  flex: 1; /* 占用剩余空间 */
  overflow-y: auto; /* 垂直滚动 */
  -webkit-overflow-scrolling: touch; /* 移动端顺滑滚动 */
  .van-row {
    background-color: #fff;
    padding: 10px;
    margin: 5px;
    border-radius: 5px;
    .text1 {
      font-size: 16px;
      line-height: 25px;
      font-weight: bold;
    }
    .text2 {
      font-size: 14px;
      line-height: 20px;
      color: #999999;
    }
  }
  .bottom-text {
    line-height: 50px;
    text-align: center;
    color: #999999;
  }
}
</style>
