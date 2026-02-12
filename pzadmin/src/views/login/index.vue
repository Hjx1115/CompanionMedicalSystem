<template>
  <el-row class="login-container" justify="center" :align="'middle'">
    <el-card style="max-width: 480px" shadow="hover">
      <template #header>
        <div class="card-header">
          <img :src="imgUrl" alt="" />
        </div>
      </template>
      <div class="jump-link">
        <el-link type="primary" @click="handleChange">{{formType ? "返回登录" : "账号注册"}}</el-link>
      </div>
      <!-- 表单 -->
      <el-form 
      ref="loginFormRef"
      :model="loginform" 
      :rules="rules"
      style="max-width: 600px"
      class="demo-ruleForm">
        <el-form-item prop="userName">
          <el-input
            v-model="loginform.userName"
            placeholder="请输入手机号"
            :prefix-icon="User"
          ></el-input>
        </el-form-item>
        <el-form-item prop="passWord">
          <el-input
            v-model="loginform.passWord"
            type="password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
          ></el-input>
        </el-form-item>
        <el-form-item prop="validCode" v-if="formType">
          <el-input
            v-model="loginform.validCode"
            placeholder="请输入验证码"
            :prefix-icon="Message"
          >
        <template #append>
            <span @click="countdownChange" style="cursor: pointer">{{ countdown.validText }}</span>
          </template>
        </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="submitForm(loginFormRef)">{{ formType ? "注册" : "登录" }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </el-row>
</template>

<script setup>
import { reactive, ref, computed, toRaw} from "vue";
import { getCode , verifyCode ,login, getUserMenu} from '@/api'
// import { ElMessage } from 'element-plus'  
import { User, Lock, Message } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { useStore } from 'vuex'

const store = useStore()
const imgUrl = new URL("../../../public/login-head.png", import.meta.url).href;
const router = useRouter();

const routerList = computed(()=>store.state.menu.routerList)
//切换表单（0：登录 1：注册）
const formType = ref(0);
//切换登陆注册
const handleChange = () => {
  formType.value = formType.value ? 0 : 1;
};

//登录表单
const loginform = reactive({
  userName: "",
  passWord: "",
  validCode: "",
});
//验证码倒计时
const countdown = reactive({
  validText: "获取验证码",
  time: 60,
});
let flag = false;
const countdownChange = () => {
  if (flag) return;
  //判断手机号正则
  const phoneReg =/^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;
  if (!loginform.userName || !phoneReg.test(loginform.userName)) {
    return ElMessage({
      message: "请输入正确的手机号",
      type: "warning",
    });
  }
  //倒计时
  const timer = setInterval(() => {
    if (countdown.time > 0) {
      countdown.time--;
      countdown.validText = `${countdown.time}秒后重发`;
    } else {
      clearInterval(timer);
      countdown.time = 60;
      flag = false;
    }
  }, 1000);
  flag = true;
  getCode({ tel: loginform.userName }).then((res) => {
    console.log("获取验证码接口返回：", res);
    if(res.code === 10000){
      ElMessage({message: "验证码发送成功，请注意查收！", type: "success"});
    } else {
      ElMessage({message: "验证码发送失败，请稍后重试！", type: "error"});
    }
  });
};

//表单验证
const rules = {
  userName: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    { pattern:/^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/, message: "请输入正确的手机号", trigger: "blur" },
  ],
  passWord: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { pattern: /^[a-zA-Z0-9_-]{4,16}$/, message: "密码长度在4到16位", trigger: "blur" },
  ],
  validCode: [
    { required: formType.value ? true : false, message: "请输入验证码", trigger: "blur" },
    { len: 4, message: "验证码为4位数字", trigger: "blur" },
  ],
};

//提交表单
const loginFormRef = ref();
const submitForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid,fields) => {
    if (valid) {
      console.log("注册表单：", loginform);
      if(formType.value){
        //注册接口调用
        verifyCode(loginform).then(({data}) => {
          console.log("验证码校验接口返回：", data);
          if(data.code === 10000){
            ElMessage({message: "注册成功！请登录！", type: "success"});
            //注册成功跳转登录
            formType.value = 0;
          } 
        });

      } else {
        console.log("登录表单：", loginform);
        //登录接口调用
        login(loginform).then(({data}) => {
          console.log("登录接口返回：", data);
          if(data.code === 10000){
            ElMessage({message: "登录成功！", type: "success"});
            //token和用户信息存储
            localStorage.setItem("pz_token", data.data.token);
            localStorage.setItem("pz_userInfo", JSON.stringify(data.data.userInfo));
            //登录成功
            getUserMenu().then(({data})=>{
              store.commit('dynamicMenu',data.data)
              console.log('routerList',routerList)
              toRaw(routerList.value).forEach(item=>{
                router.addRoute('main',item)
              })
              router.push('/');
            })
          } 
        });
      }
    } else {
      console.log("表单验证失败：", fields);
      return false;
    }
  });
};
</script>

<style lang="less" scoped>
:deep(.el-card__header) {
    padding: 0
  }
  .login-container {
    height: 100%;
    .card-header{
      background-color: #899fe1;
      img {
        width: 430px;
      }
    }
    .jump-link {
      text-align: right;
      margin-bottom: 10px;
    }
  }
</style>
