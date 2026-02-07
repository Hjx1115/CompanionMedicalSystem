<template>
    <PanelHead :route="route"/>
  <div class="addBtn">
    <el-button :icon="Plus" @click="open()" type="primary">添加</el-button>
    <el-popconfirm
      width="220"
      :icon="InfoFilled"
      icon-color="#626AEF"
      title="是否确认删除？"
      @cancel="onCancel"
      confirm-button-text="是"
      cancel-button-text="否"
      @confirm="onConfirm"
    >
      <template #reference>
        <el-button :icon="Delete" type="danger">删除</el-button>
      </template>
    </el-popconfirm>
  </div>
  <!-- 添加陪护师表单 -->
  <el-dialog
    v-model="dialogFormVisible"
    :before-close="beforeClose"
    title="添加陪护师"
    width="500px"
  >
    <el-form
      label-width="80px"
      ref="formRef"
      label-position="left"
      :model="form"
      :rules="rules"
    >
      <el-form-item v-show="false" prop="id">
        <el-input v-model="form.id"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" placehoder="请输入昵称"></el-input>
      </el-form-item>
      <el-form-item label="头像" prop="avater">
        <el-button
          v-if="!form.avatar"
          type="primary"
          @click="dialogImgVisible = true"
          >点击上传</el-button
        >
        <el-image
          v-else
          :src="form.avatar"
          style="width: 100px; height: 100px"
          @click="dialogImgVisible = true"
        >
        </el-image>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="form.sex" placehoder="请选择性别">
          <el-option label="男" value="1">男</el-option>
          <el-option label="女" value="2">女</el-option>
        </el-select>
      </el-form-item>
      <el-form-item lable="年龄" prop="age">
        <el-input-number
          v-model="form.age"
          :min="18"
          :max="50"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="form.mobile" placehoder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="是否生效" prop="active">
        <el-radio-group v-model="form.active">
          <el-radio :value="1">在职</el-radio>
          <el-radio :value="0">失效</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer class="footer">
      <el-button type="primary" @click="submitForm(formRef)">确 定</el-button>
    </template>
  </el-dialog>
  <!-- 选择头像弹窗 -->
  <el-dialog
    v-model="dialogImgVisible"
    :before-close="beforeListClose"
    title="请选择头像"
    width="680px"
  >
    <div class="image-list">
      <div
        v-for="(item, index) in avatarList"
        :key="item.name"
        class="img-box"
        @click="selectedAvatarIndex = index"
      >
        <div v-if="index === selectedAvatarIndex" class="select">
          <el-icon color="#fff"><Check /></el-icon>
        </div>
        <el-image
          :src="item.url"
          style="width: 148px; height: 148px"
        ></el-image>
      </div>
    </div>
    <template #footer class="footer">
      <el-button @click="beforeListClose">取 消</el-button>
      <el-button type="primary" @click="submitAvatar">确 定</el-button>
    </template>
  </el-dialog>
  <!-- 陪护师列表 -->
  <el-table
    :data="tableData.list"
    stripe
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="55" />
    <!-- 多选 -->
    <el-table-column prop="id" label="ID"></el-table-column>
    <el-table-column prop="name" label="昵称"></el-table-column>
    <el-table-column prop="avatar" label="头像">
      <template #default="scope">
        <el-image
          style="width: 50px; height: 50px"
          :src="scope.row.avatar"
        ></el-image>
      </template>
    </el-table-column>
    <el-table-column prop="sex" label="性别">
      <template #default="scope">
        {{ scope.row.sex === "1" ? "男" : "女" }}
      </template>
    </el-table-column>
    <el-table-column prop="mobile" label="手机号"></el-table-column>
    <el-table-column prop="active" label="状态">
      <template #default="scope">
        <el-tag :type="scope.row.active ? 'success' : 'danger'">{{
          scope.row.active ? "在职" : "失效"
        }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="create_time" label="创建时间">
      <template #default="scope">
        <div class="flex-box">
          <el-icon><Clock /></el-icon>
          <span style="margin-left: 10px">{{ scope.row.create_time }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="编辑">
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
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from "vue";
import {Plus,Check,Clock,Delete,InfoFilled} from "@element-plus/icons-vue";
import {getStaffAvatar,addStaff,getStaffList,deleteStaff} from "../../../api";
import dayjs from "dayjs";
import { useRoute } from 'vue-router'
// import { ElMessage } from "element-plus/lib/components/index.js";

const route = useRoute()
const dialogFormVisible = ref(false);
//选择头像弹窗
const dialogImgVisible = ref(false);
const avatarList = ref([]);
const formRef = ref();
const selectedAvatarIndex = ref(0);
onMounted(() => {
  getListData();
  getStaffAvatar().then(({ data }) => {
    avatarList.value = data.data;
  });
});
const beforeListClose = () => {
  dialogImgVisible.value = false;
};
const submitAvatar = () => {
  form.avatar = avatarList.value[selectedAvatarIndex.value].url;
  beforeListClose();
};
//表单逻辑
const beforeClose = () => {
  dialogFormVisible.value = false;
  formRef.value.resetFields();
};
const form = reactive({
  id: "",
  mobile: "",
  active: 1,
  age: 28,
  avatar: "",
  name: "",
  sex: "",
});
const rules = reactive({
  name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  mobile: [
    {
      required: true,
      message: "请输入正确手机号",
      trigger: "blur",
      pattern:
        /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/,
    },
  ],
  avatar: [{ required: true, message: "请选择头像" }],
  sex: [{ required: true, message: "请选择性别", trigger: "change" }],
});
const submitForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      addStaff(form).then(({ data }) => {
        if (data.code === 10000) {
          ElMessage({ message: "创建成功", type: "success" });
          beforeClose();
          getListData();
        } else {
          ElMessage({ message: data.message, type: "error" });
        }
      });
    } else {
      console.log("表单验证失败！", fields);
    }
  });
};
const open = (rowData = {}) => {
  dialogFormVisible.value = true;
  nextTick(() => {
    if (rowData) {
      Object.assign(form, rowData);
    }
  });
};
//列表数据
const tableData = reactive({
  list: [],
  total: 0,
});
const paginationData = reactive({
  pageNum: 1,
  pageSize: 10,
});
//请求列表数据封装
const getListData = () => {
  getStaffList(paginationData).then(({ data }) => {
    const { list, total } = data.data;
    list.forEach((element) => {
      element.create_time = dayjs(element.create_time).format("YYYY-MM-DD");
    });
    tableData.list = list;
    tableData.total = total;
  });
};
//多选删除
const selectedData = ref([]);
const handleSelectionChange = (val) => {
  selectedData.value = val.map(item=>({id: item.id}));
};
const onConfirm = () => {
  if (selectedData.value.length === 0) {
    return ElMessage.warning({ message: "请选择要删除的内容！", type: "warning" });
  }
    deleteStaff({id:selectedData.value}).then(({ data }) => {
        if(data.code==10000){
            ElMessage.success({ message: data.data, type: "success" });
            getListData()
        }
    });
};
const onCancel = () => {};
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
.addBtn {
  padding: 10px 0 10px 10px;
  background-color: #fff;
}
.image-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .img-box {
    position: relative;
    .select {
      position: absolute;
      left: 0px;
      top: 0px;
      width: 24px;
      height: 24px;
      background-color: #67c23a;
      z-index: 999;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .el-image {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
</style>
