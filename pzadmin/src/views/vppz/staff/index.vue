<template>
  <div class="addBtn">
    <el-button :icon="Plus" @click="open(null)" type="primary">添加员工</el-button>
  </div>
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
        <el-button v-if="!form.avatar" type="primary">点击上传</el-button>
        <el-image v-else :src="form.avatar" style="width: 100px; height: 100px">
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
          <el-radio value="0">失效</el-radio>
          <el-radio value="1">生效</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer class="footer">
      <el-button type="primary" @click="submitForm(formRef)">确 定</el-button>
    </template>
  </el-dialog>
  <el-dialog
    v-model="dialogImgVisible"
    :before-close="beforeClose"
    title="请选择头像"
    width="500px"
  >

  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { Plus } from '@element-plus/icons-vue'
import {getStaffAvatar}from '../../../api'

const dialogFormVisible = ref(false);
const dialogImgVisible = ref(false);
const beforeClose = () => {
    dialogFormVisible.value=false
};
const formRef = ref();
const form = reactive({
  id: "",
  mobile: "",
  active: 1,
  age: 28,
  avatar: "",
  name: "",
  sex: "",
});
const rules = reactive({});
const submitForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
    } else {
      console.log("表单验证失败！", fields);
    }
  });
};
const open=()=>{
    dialogFormVisible.value=true
}
</script>

<style lang="less" scoped>
.addBtn {
  padding: 10px 0 10px 10px;
  background-color: #fff;
}
</style>
