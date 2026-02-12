import axios from "axios";

//创建axios实例

const http = axios.create({
  baseURL: "https://v3pz.itndedu.com/v3pz", // url = base url + request url
  timeout: 10000, // request timeout
  headers:{"terminal":"h5"}
});

//添加拦截器
http.interceptors.request.use(
  (config) => {
    //在发送请求之前
    const token = localStorage.getItem("h5_token");
    //不需要添加token的接口
    const whiteUrl = ["/login"];
    if (token && !whiteUrl.includes(config.url)) {
      config.headers["h-token"] = token;
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
      
    }
    if (response.data.code === -2) {
      localStorage.removeItem("h5_token");
      localStorage.removeItem("h5_userInfo");
      
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
