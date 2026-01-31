import request from '@/utils/request';
import { ElMessage } from 'element-plus'  

// 获取验证码
export function getCode(data) {
  return request.post('/get/code',data);
}
//验证码校验
export function verifyCode(data) {
  return request.post('/user/authentication',data);
}
//用户登录
export function login(data) {
  return request.post('/login',data);
}