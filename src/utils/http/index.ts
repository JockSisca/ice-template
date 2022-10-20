import Axios, { ResponseType } from 'axios';
import { APP_MODE } from 'ice';
import MockObject from '../../../mock/index';
import { getUrlApiName, isObject } from '../tools';
import { addPending, clearPending, removePending } from './cancelRequest';

const openMock = APP_MODE === 'dev'; // 是否开启mock

let mockList: string[] = [];

let baseUrl = 'xxxxx'; // 请求的url

console.log('openMock', openMock);

if (APP_MODE === 'dev') {
  // 开发环境
  baseUrl = 'xxxx';
} else if (APP_MODE === 'prod') {
  // 线上环境
  baseUrl = 'xxxx';
} else if (APP_MODE === 'dbg') {
  // 测试环境
  baseUrl = 'xxxx';
}

console.log('openMock', openMock, isObject(MockObject), MockObject);
if (openMock) {
  if (isObject(MockObject)) {
    mockList = Object.keys(MockObject).map((key) => {
      return key.replace(/(POST|GET|\s*)\s*/, '');
    });
    console.warn('mock数据已经开启', mockList);
  }
}

export const url = {
  api: `${baseUrl}`,
};

const axios = Axios?.create({
  baseURL: url?.api,
  timeout: 20000,
  headers: {
    Accept: 'application/json, text/javascript, */*',
    'Content-Type': 'application/json; charset=UTF-8',
  },
});

axios?.interceptors?.request?.use(
  (config) => {
    if (openMock) {
      mockList.forEach((mockKey) => {
        if (config.url === mockKey) {
          console.log(`接口：${mockKey}被替换mock`, config.url);
          config.url = `${location.origin}${config.url}`;
        }
      });
    }

    console.log(`%c 发送 ${getUrlApiName(config.url)} `, 'background:#62D438;color:#333', config.data);
    addPending(config);
    return config;
  },
  (error) => {
    console.error(error.message);
    return Promise.reject(error);
  }
);

axios?.interceptors?.response?.use(
  (res) => {
    removePending(res?.request);

    const { code } = res?.data;
    console.log(`%c 接收 ${getUrlApiName(res.config.url)} `, 'background:#1E1E1E;color:#bada55', JSON.parse(JSON.stringify(res.data)));
    if (code !== undefined) {
      if (code === 0) {
        return Promise.resolve(res.data.data);
      } else if (code === 'xxxx') {
        clearPending();
        return new Promise(() => {});
      } else if (res.data) {
        return Promise?.reject(res);
      }
    } else if (res.data) {
      return Promise.resolve(res);
    }
    return res;
  },
  (error) => {
    console.log('-----> error', error);
    // 被cancel的error特殊处理，返回pending状态，防止业务端抛出message信息
    if (Axios.isCancel(error)) {
      return new Promise(() => {});
    }
    const res = error.response;
    return Promise.reject(error.message);
  }
);

export function get<T>(url: string, params?: { [key: string]: any }, responseType?: ResponseType) {
  return axios.get<T, T>(`${url}`, { params, responseType });
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post<T>(url: string, params?: { [key: string]: any }, blob = false) {
  return axios.post<T, T>(`${url}`, params, blob ? { responseType: 'blob' } : {});
}
