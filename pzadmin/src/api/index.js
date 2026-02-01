import request from '@/utils/request';
// import { ElMessage } from 'element-plus'  

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
//权限管理列表
export function getUserPermission(params) {
  return request.get('/auth/admin',{params});
}
//权限组列表
export function getPermissionGroup() {
  return request.get('/user/getmenu');
}
//新增权限组
export function addPermissionGroup(data) {
  return request.post('/user/setmenu',data);
}
//获取更新的权限菜单
export function getMenuList(params) {
    return request.get('/menu/list',{params});
}
//菜单权限下拉
export function getMenuSelectList() {
    return request.get('/menu/selectlist');
}
//用户信息修改
export function updateUser(data) {
  return request.post('/update/user',data);
}