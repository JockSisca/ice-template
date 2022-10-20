function isObject(value: any): boolean {
  const type = typeof value;
  return value != null && (type === 'object' || type === 'function');
}

/**
 * 获取url 最后一个/到?开头的数据
 * @param url
 */
function getUrlApiName(url: string | undefined) {
  try {
    return url?.match(/[^/]+?(?=\?|$)/)?.[0] ?? url;
  } catch (error) {
    console.warn(error);
    return url;
  }
}

interface DebouncedFunc<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): ReturnType<T> | undefined;
  cancel(): void;
  flush(): ReturnType<T> | undefined;
}
interface DebounceOptions {
  /** 立即执行 */
  leading?: boolean;
  /** 最大等待时间 */
  maxWait?: number;
  /** 最后一次也要执行，多用于节流 */
  trailing?: boolean;
}
/**
 * 防抖
 * @example
 * ```
 * debounce<(progress: number) => void>(progress => {}, 40)
 * ```
 */
function debounce<T extends (...args: any) => any>(func: T, wait = 0, options?: DebounceOptions): DebouncedFunc<T> {
  let lastArgs: IArguments | undefined;
  let lastThis: any;
  let maxWait: number | undefined;
  let result: any;
  let timerId: NodeJS.Timeout | undefined;
  let lastCallTime: number | undefined;
  let lastInvokeTime = 0;
  let leading = false;
  let maxing = false;
  let trailing = true;

  if (typeof func !== 'function') {
    throw new Error('回调必须是函数');
  }
  wait = +wait || 0;
  if (options && isObject(options)) {
    leading = !!options?.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? Math.max(+(options?.maxWait ?? 0) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time: number) {
    const args = lastArgs;
    const thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args as unknown as any[]);
    return result;
  }

  function leadingEdge(time: number) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time: number) {
    const timeSinceLastCall = time - (lastCallTime as number);
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = wait - timeSinceLastCall;

    return maxing ? Math.min(timeWaiting, (maxWait as number) - timeSinceLastInvoke) : timeWaiting;
  }

  function shouldInvoke(time: number) {
    const timeSinceLastCall = time - (lastCallTime as number);
    const timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxing && timeSinceLastInvoke >= (maxWait as number))
    );
  }

  function timerExpired() {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time: number) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(Date.now());
  }

  function debounced(this: any) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        clearTimeout(timerId);
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}
interface ThrottleOptions {
  /** 默认值 true 立即执行 */
  leading?: boolean;
  /** 默认值 true 最后一次也要执行，多用于节流 */
  trailing?: boolean;
}
/**
 * 节流
 * @example
 * ```
 * throttle<(progress: number) => void>(progress => {}, 40)
 * ```
 */
function throttle<T extends (...args: any) => any>(func: T, wait?: number, options?: ThrottleOptions): DebouncedFunc<T> {
  let leading = true;
  let trailing = true;
  if (wait === undefined) wait = 300;
  if (typeof func !== 'function') {
    throw new Error('回调必须是函数');
  }
  if (options && isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    leading,
    maxWait: wait,
    trailing,
  });
}
function jsonCheck(str) {
  if (typeof str === 'string') {
    try {
      const data = JSON.parse(str);
      return data;
    } catch (e) {
      return str;
    }
  } else {
    return str;
  }
}
/**
 * @desc 对象Key排序并生成key=value&
 * @param {Object} jsonObj 排序对象
 * @param {Boolean} isSort 是否排序
 */
function jsonSort(jsonObj: { [key: string]: any }, isSort = false) {
  const arr: string[] = [];
  for (const key in jsonObj) {
    if (Object.prototype.hasOwnProperty.call(jsonObj, key)) arr.push(key);
  }
  isSort && arr.sort();
  let str = '';
  for (const i in arr) {
    // 过滤掉 Array.prototype.xxx进去的字段

    if (Object.prototype.hasOwnProperty.call(arr, i)) {
      let value = '';
      if (Object.prototype.toString.call(jsonObj[arr[i]]) === '[object Object]') {
        value = JSON.stringify(jsonObj[arr[i]]);
      } else {
        value = jsonObj[arr[i]];
      }
      str += `${arr[i]}=${value}&`;
    }
  }
  return str.substr(0, str.length - 1);
}
interface IStorageConfig {
  /** 设置失效时间ms */
  expires?: number;
}
function setStorage(key: string, value: any, config: IStorageConfig = {}) {
  try {
    const { expires = 0 } = config;
    if (expires > 0) {
      return localStorage.setItem(
        key,
        JSON.stringify({
          __expires__: expires + Date.now(),
          __data__: value,
        })
      );
    }
    return localStorage.setItem(key, value);
  } catch (error) {
    console.error('setStorage key error', key, error);
  }
}
function removeStorage(key) {
  return localStorage.removeItem(key);
}

function getStorage<T>(key: string): T | null | any {
  if (key === undefined) return null;
  let msg = localStorage.getItem(key) as any;
  if (msg === null || msg === undefined) {
    console.warn('getStorage msg is undefined and key is:', key);
    return null;
  }
  msg = jsonCheck(msg);
  if (msg?.__expires__) {
    console.log('msg.__expires__', key, msg.__expires__, Date.now());

    if (msg.__expires__ > Date.now()) {
      return msg?.__data__;
    } else {
      removeStorage(key); // 过期了，清除掉
      return ''; // getStorageSync拿不到默认返回''
    }
  } else {
    return msg;
  }
}

/**
 * 秒转时间
 * @param {*} val 秒数
 * @param {*} type 'hms'返回时分秒 | 'ms'分秒 | 's'秒
 */
function secondToDate(val: number, type?: 'hms' | 'ms' | 's') {
  let h = Math.floor(val / 3600).toString();
  let m = Math.floor((val / 60) % 60).toString();
  let s = Math.floor(val % 60).toString();
  h = h.length < 2 ? `0${h}` : h;
  m = m.length < 2 ? `0${m}` : m;
  s = s.length < 2 ? `0${s}` : s;
  switch (type) {
    case 'hms':
      return `${h}:${m}:${s}`;
    case 'ms':
      return `${h}:${s}`;
    case 's':
      return s;
    default:
      return `${m}${s}`;
  }
}

/**
 * @description: 图片质量压缩
 * @param {string} url 图片链接
 * @param {number} width 限定缩略图的宽最多为width
 * @param {string} format 新图的输出格式
 * @param {number} quality 新图的图片质量<取值范围是[1, 100]，默认75。>
 * @decs https://developer.qiniu.com/dora/api/basic-processing-images-imageview2
 */
function getPicture(url: string, width = 300, format = 'normal', quality = 85) {
  if (format === 'webp') {
    return `${url}?imageView2/format/webp/2/w/${width}/q/${quality}!`;
  } else {
    return `${url}?imageView2/2/w/${width}/q/${quality}!`;
  }
}

/**
 * @description: url拼接上需要的参数
 * @param {string} url 跳转链接
 * @param {object} params 需要拼接上的参数
 * @return {*}
 */
function urlConcatParams(url: string, params: { [key: string]: any }) {
  for (const key in params) {
    if (params[key] !== '') {
      url += `${url.indexOf('?') === -1 ? '?' : '&'}${key}=${params[key]}`;
    }
  }

  return url;
}
/**
 * @param obj 转换对象
 * @param isNumberKey 是否是数字类型的key
 */
function json2Map<T, G>(obj: { [key: string]: any }, isNumberKey?: boolean): Map<T, G> {
  if (!isObject(obj)) {
    console.error(obj, 'is not a object');
    return new Map();
  }
  const map = new Map();
  for (const [id, name] of Object.entries(obj) ?? []) {
    if (isNumberKey) {
      map.set(Number(id), name);
    } else {
      map.set(id, name);
    }
  }
  return map;
}
/* 限制数字输入框只能输入整数 */
const digitToInt = (value) => {
  if (typeof value === 'string') {
    return !isNaN(Number(value)) ? value.replace(/^(0+)|[^\d]/g, '') : '';
  } else if (typeof value === 'number') {
    return !isNaN(value) ? String(value).replace(/^(0+)|[^\d]/g, '') : '';
  } else {
    return '';
  }
};
/** inputNumber toFixed 2 */
function digitToFixed2(value) {
  console.log('value', value);

  const reg = /^(-)*(\d+)\.(\d\d).*$/;
  if (typeof value === 'string') {
    return !isNaN(Number(value)) ? value.replace(reg, '$1$2.$3') : '';
  } else if (typeof value === 'number') {
    return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : '';
  } else {
    return '';
  }
}

/** 将文件转换成base64 */
function getBase64(file: Blob): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
/** 获取唯一值 */
function getUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    // eslint-disable-next-line no-bitwise
    const r = (Math.random() * 16) | 0;
    // eslint-disable-next-line no-bitwise
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// 精度计算
function P() {
  /*
   * 判断obj是否为一个整数
   */
  function isInteger(obj: number) {
    return Math.floor(obj) === obj;
  }

  /*
   * 将一个浮点数转成整数，返回整数和倍数。如 3.14 >> 314，倍数是 100
   * @param floatNum {number} 小数
   * @return {object}
   *   {times:100, num: 314}
   */
  function toInteger(floatNum: number) {
    const ret = { times: 1, num: 0 };
    const isNegative = floatNum < 0;
    if (isInteger(floatNum)) {
      ret.num = floatNum;
      return ret;
    }
    const strfi = `${floatNum}`;
    const dotPos = strfi.indexOf('.');
    const len = strfi.substr(dotPos + 1).length;
    const times = Math.pow(10, len);
    let intNum = parseInt(`${Math.abs(floatNum) * times + 0.5}`, 10);
    ret.times = times;
    if (isNegative) {
      intNum = -intNum;
    }
    ret.num = intNum;
    return ret;
  }

  /**
   * 核心方法，实现加减乘除运算，确保不丢失精度
   * 思路：把小数放大为整数（乘），进行算术运算，再缩小为小数（除）
   *
   * @param a {number} 运算数1
   * @param b {number} 运算数2
   * @param op {string} 运算类型，有加减乘除（add/subtract/multiply/divide）
   *
   */
  function operation(a: number, b: number, op: string): number {
    const o1 = toInteger(a);
    const o2 = toInteger(b);
    const n1 = o1.num;
    const n2 = o2.num;
    const t1 = o1.times;
    const t2 = o2.times;
    const max = t1 > t2 ? t1 : t2;
    let result: number | null = null;
    switch (op) {
      case 'add':
        if (t1 === t2) {
          // 两个小数位数相同
          result = n1 + n2;
        } else if (t1 > t2) {
          // o1 小数位 大于 o2
          result = n1 + n2 * (t1 / t2);
        } else {
          // o1 小数位 小于 o2
          result = n1 * (t2 / t1) + n2;
        }
        return result / max;
      case 'subtract':
        if (t1 === t2) {
          result = n1 - n2;
        } else if (t1 > t2) {
          result = n1 - n2 * (t1 / t2);
        } else {
          result = n1 * (t2 / t1) - n2;
        }
        return result / max;
      case 'multiply':
        result = (n1 * n2) / (t1 * t2);
        return result;
      case 'divide':
        result = (n1 / n2) * (t2 / t1);
        return result;
      default:
        return 0;
    }
  }

  function add(a: number, b: number) {
    return operation(a, b, 'add');
  }
  function subtract(a: number, b: number, digits: number) {
    return operation(a, b, 'subtract').toFixed(digits);
  }
  function multiply(a: number, b: number, digits: number) {
    return operation(a, b, 'multiply').toFixed(digits);
  }
  function divide(a: number, b: number, digits: number) {
    return operation(a, b, 'divide').toFixed(digits);
  }

  // exports
  return {
    add,
    subtract,
    multiply,
    divide,
  };
}

export {
  P,
  getUUID,
  getBase64,
  digitToInt,
  digitToFixed2,
  isObject,
  json2Map,
  urlConcatParams,
  getPicture,
  secondToDate,
  getStorage,
  removeStorage,
  setStorage,
  jsonSort,
  throttle,
  debounce,
  getUrlApiName,
};
