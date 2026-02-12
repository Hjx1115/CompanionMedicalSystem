<template>
    <PanelHead :route="route"/>
    <div class="form">
        <el-form :model="searchForm" :inline="true">
            <el-form-item prop="out_trade_no">
                <input type="text" v-model="searchForm.out_trade_no" placeholder="订单号" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSearch">查询</el-button>
            </el-form-item>
        </el-form>
        
    </div>
    <el-table :data="tableData.list">
        <el-table-column prop="out_trade_no" label="订单号" width="150" fixed="left"></el-table-column>
        <el-table-column prop="hospital_name" label="就诊医院"></el-table-column>
        <el-table-column prop="service_name" label="陪诊服务"></el-table-column>
        <el-table-column label="陪护师头像" >
            <template #default="scope">
                <el-image style="width:50px;height:50px" :src="scope.row.companion?.avatar || 'vite.svg'"></el-image>
            </template>
        </el-table-column>
        <el-table-column label="陪护师手机号" #default="scope" width="120">
            {{ scope.row.companion?.mobile || 13111111111}}
        </el-table-column>
        <el-table-column prop="price" label="总价"></el-table-column>
        <el-table-column prop="paidPrice" label="已付"></el-table-column>
        <el-table-column label="下单时间" width="120">
            <template #default="scope">
                {{dayjs(scope.row.order_start_time).format("YYYY-MM-DD")}}
            </template>
        </el-table-column>
        <el-table-column label="订单状态" >
            <template #default="scope" >
                <el-tag :type="statusMap(scope.row.trade_state)">{{ scope.row.trade_state}}</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="service_state" label="接单状态"></el-table-column>
        <el-table-column prop="tel" label="联系人手机号" width="120"></el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
            <template #default="scope" >
                <el-popconfirm
                    width="220"
                    :icon="InfoFilled"
                    icon-color="#626AEF"
                    title="是否确认完成？"
                    @cancel="onCancel"
                    confirm-button-text="是"
                    cancel-button-text="否"
                    @confirm="onConfirm(scope.row.out_trade_no)"
                    v-if="scope.row.trade_state === '待服务'"
                    >
                    <template #reference>
                        <el-button type="primary" link>完成服务</el-button>
                    </template>
                </el-popconfirm>
                <el-button v-else type="primary"link disabled>暂无服务</el-button>
            </template>
        </el-table-column>
    </el-table>
    <!-- 分页 -->
  <div class="pagination-info">
    <el-pagination
      v-model:current-page="paginationData.pageNum"
      :page-size="paginationData.pageSize"
      size="large"
      :background="false"
      layout="total, prev, pager, next"
      :total="tableData.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted} from "vue";
import { getOrderList, updateOrder} from '@/api';
import {InfoFilled} from "@element-plus/icons-vue";
import { useRouter, useRoute } from "vue-router";
import dayjs from "dayjs";

onMounted(() => {
  getListData();
});
//列表数据
const tableData = reactive({
  list: [],
  total: 0,
});
//分页参数
const paginationData = reactive({
  pageNum: 1,
  pageSize: 10,
});
const route = useRoute()
const router = useRouter();
//请求列表数据封装
const getListData = (params={}) => {
  getOrderList({...paginationData,...params}).then(({ data }) => {
    const { list, total } = data.data;
    tableData.list = list;
    tableData.total = total;
  });
};
//订单状态映射
const statusMap=(key)=>{
    const obj={
        '已取消':'info',
        '待支付':'warning',
        '已完成':'success',
        '待服务':'primary',
    }
    return obj[key]
}
//修改订单状态
const onConfirm=(id)=>{
    updateOrder({id}).then(({data})=>{
        if(data.code===10000){
            getListData()
        }
    })

}
//表单搜索
const searchForm=reactive({
    out_trade_no:''
})
const onSearch=()=>{
    getListData(searchForm)

}
//分页操作
const handleSizeChange = (val) => {
  paginationData.pageSize = val;
  getListData();
};

const handleCurrentChange = (val) => {
  paginationData.pageNum = val;
  getListData();
};
</script>

<style lang="less" scoped>
.form{
    display: flex;
    justify-content: flex-end;
    padding: 10px 0 10px 0;
    background-color: #fff;
    width: 100%;
}
</style>