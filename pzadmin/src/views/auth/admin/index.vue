<template>
  <PanelHead/>
  <el-table :data="tableData.list" stripe>
    <el-table-column prop="id" label="ID"></el-table-column>
    <el-table-column prop="name" label="昵称"></el-table-column>
    <el-table-column prop="permissions_id" label="所属权限组别">
        <template #default="scope">
            {{permissionName(scope.row.permissions_id)}}
        </template>
    </el-table-column>
    <el-table-column prop="mobile" label="手机号"></el-table-column>
    <el-table-column prop="active" label="状态">
        <template #default="scope">
            <el-tag :type="scope.row.active? 'success':'danger'">{{scope.row.active? '正常':'失效'}}</el-tag>
        </template>
    </el-table-column>
    <el-table-column prop="create_time" label="创建时间">
        <template #default="scope">
            <div class="flex-box">
                <el-icon><Clock/></el-icon>
                <span style="margin-left: 10px;">{{ scope.row.create_time }}</span>
            </div>
        </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button type="primary" size="mini" @click="open(scope.row)"
          >编辑</el-button
        >
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
   <!-- 弹窗 -->
   <el-dialog
    v-model="dialogVisible"
    :before-close="beforeClose"
    title="添加权限"
    width="500px"
  >
    <el-form
      label-width="80px"
      ref="formRef"
      label-position="left"
      :model="form"
      :rules="rules"
    >
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="form.mobile" placeholder="请输入手机号" disabled></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="name">
        <el-input v-model="form.name" placeholder="请输入昵称"></el-input>
      </el-form-item>
      <el-form-item label="菜单权限" prop="permissions_id">
        <el-select
            v-model="form.permissions_id"
            placehoder="请选择权限"
            style="width: 240px;"
        >
            <el-option
                v-for="item in select"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            >
            </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer class="footer">
      <el-button type="primary" @click="submitForm(formRef)">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { getUserPermission } from "../../../api";
import { reactive, onMounted, ref } from "vue";
import { getMenuSelectList, updateUser } from "../../../api";
import dayjs from 'dayjs'
import { Clock } from '@element-plus/icons-vue'

const paginationData = reactive({
  pageNum: 1,
  pageSize: 10,
});
//请求列表数据封装
const getListData=()=>{
    getUserPermission(paginationData).then(({ data }) => {
    console.log("用户权限数据：", data);
    const { list,total}=data.data
    list.forEach(element => {
        element.create_time=dayjs(element.create_time).format('YYYY-MM-DD')
    });
    tableData.list=list
    tableData.total=total
  });
}
onMounted(() => {
  getListData()
  getMenuSelectList().then(({data})=>{
    select.value=data.data
  });
});
//列表数据
const tableData = reactive({
  list: [],
  total: 0,
});
const select =ref([])
const formRef=ref([])
const permissionName=(id)=>{
    const data = select.value.find(res=>res.id===id)
    return data ? data.name : '超级管理员'
}
//操作
// 表单数据
const form = reactive({
    name: "",
    permissions_id: "",
});

// 对话框显示控制
const dialogVisible = ref(false);
const beforeClose = () => {
  dialogVisible.value = false;
};
const open=(rowData)=>{
    dialogVisible.value = true;
    Object.assign(form,{mobile:rowData.mobile,name:rowData.name,permissions_id:rowData.permissions_id})
}
//提交
const submitForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      //获取输入内容，更新表单
      updateUser({ name: form.name, permissions_id: form.permissions_id }).then(
        ({ data }) => {
          console.log("添加用户接口返回：", data);
          if (data.code === 10000) {
              ElMessage.success({ message: "操作成功！", type: "success" });
              beforeClose()
              getListData()
            }
        },
    );
} else {
    console.log("表单验证失败！", fields);
    }
  });
};
const rules=reactive({
    name:[{required:true,trigger:'blur',message:'请填写昵称'}],
    permissions_id:[{required:true,trigger:'blur',message:'请选择菜单权限'}]
})
//分页操作
const handleSizeChange=(val)=>{
  paginationData.pageSize=val
  getListData()
}

const handleCurrentChange=(val)=>{
  paginationData.pageNum=val
  getListData()
}
</script>

<style lang="less" scoped>
    .flex-box{
        display: flex;
        align-items: center;
    }
</style>
