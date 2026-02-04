import axios from "axios";
import { ElMessage } from "element-plus";

//创建axios实例

const http = axios.create({
  baseURL: "https://v3pz.itndedu.com/v3pz", // url = base url + request url
  timeout: 10000, // request timeout
});

//添加拦截器
http.interceptors.request.use(
  (config) => {
    //在发送请求之前
    const token = localStorage.getItem("pz_token");
    //不需要添加token的接口
    const whiteUrl = ["/get/code", "/user/authentication", "/login"];
    if (token && !whiteUrl.includes(config.url)) {
      config.headers["x-token"] = token;
    }
    return config;
  },
  (error) => {
    //对请求错误做些什么
    return Promise.reject(error);
  },
);

http.interceptors.response.use(
  (response) => {
    //对异常响应数据做提示
    if (response.data.code === -1) {
      ElMessage.warning({ message: response.data.message });
    }
    if (response.data.code === -2) {
      localStorage.removeItem("pz_token");
      localStorage.removeItem("pz_userInfo");
      localStorage.removeItem("pz_v3pz");
      ElMessage.error({ message: "登录已过期，请重新登录！" });
      setTimeout(() => {
          window.location.href = window.location.origin + "/#/login";
      }, 1000);
    }
    return response;
  },
  (error) => {
    //对响应错误做点什么
    return Promise.reject(error);
  },
);

export default http;
