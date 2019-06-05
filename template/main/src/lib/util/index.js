import axios from 'axios';
// import qs from 'qs'
import getUrl from '@/config/api';
import dataMap from '@/config/data-map';

function iterateObject(object, handler) {
  const keys = Object.keys(object);
  keys.forEach((key) => {
    const value = object[key];
    handler(value, key, object);
  });
}

// 发出http请求
export function $request({
  name = '', method = 'GET', download = false, data = {}, customConfig = {},
}) {
  let options = {
    url: getUrl(name),
    withCredentials: true,
    method,
    ...customConfig, // 其他必要的参数，参见axios文档
  };
  // GET发送的公共参数
  const commonParams = {};
  // 区分请求方式
  if (method === 'GET') {
    options = { ...options, params: Object.assign(commonParams, data) };
  } else {
    options = {
      ...options, params: commonParams, data,
    };
  }
  if (download) {
    // 下载文件
    const arr = [];

    iterateObject(options.params, (value, key) => {
      arr.push(`${key}=${value}`);
    });

    const str = arr.join('&');
    window.open(`${options.url}?${str}`);
    return false;
  }
  // 普通请求
  return new Promise((resolve, reject) => {
    axios(options).then((res) => {
      resolve(res.data);
    }).catch((err) => {
      reject(err);
    });
  });
}

// 处理请求结果
export function handleRes(res, message = {}) {
  if (res && res.code) {
    if (res.code === 100) {
      // 假定只有code为100情况请求成功
      if (message.success) {
        console.log(message.success);
      }
      return true;
    }
    // 收到返回值但有异常
    alert(res.data || '网络错误');
    console.error(res);
    return false;
  }
  // 未收到返回值且有异常
  alert(message.fail || '系统错误');
  console.error(res);
  return false;
}

// 已知src/config/data-map中的value，得到label
export function valueToLabel(type, value) {
  const valueString = String(value);
  const currentMap = dataMap[type];
  if (!Array.isArray(currentMap)) return undefined;
  let result;
  currentMap.forEach((item) => {
    if (String(item.value) === valueString) {
      result = item.label;
    }
  });
  return result;
}

// 已知src/config/data-map中的label，得到value
export function labelToValue(type, label) {
  const labelString = String(label);
  const currentMap = dataMap[type];
  if (!Array.isArray(currentMap)) return undefined;
  let result;
  currentMap.forEach((item) => {
    if (String(item.label) === labelString) {
      result = item.value;
    }
  });
  return result;
}

export { iterateObject };
