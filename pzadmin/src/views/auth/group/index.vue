<template>
  <PanelHead :route="route"/>
  <div class="addBtn">
    <el-button :icon="Plus" @click="open(null)" type="primary">添加权限</el-button>
  </div>
  <el-table :data="tableData.list" stripe>
    <el-table-column prop="id" label="ID"></el-table-column>
    <el-table-column prop="name" label="权限组名称"></el-table-column>
    <el-table-column prop="permissionName" label="权限"></el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button
          type="primary"
          size="mini"
          @click="open(scope.row)"
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
   <!-- 添加权限弹窗 -->
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
      <el-form-item prop="id" v-show="false">
        <el-input v-model="form.id"></el-input>
      </el-form-item>
      <el-form-item label="权限名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入权限名称"></el-input>
      </el-form-item>
      <el-form-item label="权限" prop="permissions">
        <el-tree
          ref="treeRef"
          :data="permissionData"
          style="max-width: 600px"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="defaultCheckedKeys"
        >
        </el-tree>
      </el-form-item>
    </el-form>
    <template #footer class="footer">
      <el-button type="primary" @click="submitForm(formRef)">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from "vue";
import { getPermissionGroup, addPermissionGroup, getMenuList } from "../../../api";
import { Plus } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'

const route = useRoute()
// 表单数据
const form = reactive({
  name: "",
  permissions: "",
  id: "",
});

// 对话框显示控制
const dialogVisible = ref(false);
const beforeClose = () => {
  dialogVisible.value = false;
  //重置表单勾选
  formRef.value.resetFields()
  //tree选择重置
  treeRef.value.setCheckedKeys(defaultCheckedKeys.value)
};

//菜单权限数据
const permissionData = ref([]);
onMounted(() => {
  getPermissionGroup().then(({ data }) => {
    console.log("权限组数据：", data);
    permissionData.value = data.data;
  });
  getListData();
});
//列表数据
const tableData=reactive({
  list: [],
  total: 0
})
//打开弹窗
const open=(rowData={})=>{
  dialogVisible.value = true
  nextTick(()=>{
    if(rowData){
      Object.assign(form,{id:rowData.id, name:rowData.name})
      treeRef.value.setCheckedKeys(rowData.permission)
    }
  })
}
//请求列表数据
 const paginationData = reactive({
        pageNum:1,
        pageSize:10,
    });
const getListData = () => {
    getMenuList(paginationData).then(({data}) => {
        console.log("权限组列表数据：", data);
        const {list,total}=data.data
        tableData.list=list
        tableData.total=total
    });
};
//默认选中权限
const defaultCheckedKeys = ref([4, 5]);
//获取树组件实例
const formRef = ref();
const treeRef = ref();
//提交表单
const rules = reactive({
  name: [{ required: true, message: "请输入权限名称", trigger: "blur" }],
});
const submitForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      //获取选中节点
      const permissions = JSON.stringify(treeRef.value.getCheckedKeys());
      addPermissionGroup({ name: form.name, permissions, id: form.id }).then(
        ({ data }) => {
          console.log("添加权限组接口返回：", data);
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
.addBtn{
  padding: 10px 0 10px 10px;
  background-color: #fff;
}
</style>
