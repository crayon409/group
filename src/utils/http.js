import axios from 'axios';
import { Navigate } from 'react-router-dom';
import app from '@/config/app.js';
// 创建 axios 实例
const http = axios.create({
  baseURL: app.api.baseUrl,
  timeout: app.api.timeout, // 请求超时时间
  headers: {
    'Content-Type': 'application/json', // 默认请求头
  },
});

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么，例如添加 token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-token'] = `${token}`;
    }
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 响应拦截器
http.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    return response.data;
  },
  (error) => {
    // 对响应错误做点什么
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 处理未授权的情况
          Navigate({ to: '/login' })
          break;
        case 404:
          // 处理未找到资源的情况
          break;
        default:
          // 处理其他错误
          break;
      }
    }
    return Promise.reject(error);
  }
);

export default http;

export const params = { page: 1, pageSize: 10 };