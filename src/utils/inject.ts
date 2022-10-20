/**
 * inject内部的方法会注入到原型中
 */
import dateFormat from '@/libs/date_format';

/** 判断对象是否是promise对象 */
function isPromise(obj: Promise<any>) {
  return (
    !!obj && // 有实际含义的变量才执行方法，变量null，undefined和''空串都为false
    (typeof obj === 'object' || typeof obj === 'function') && // 初始promise 或 promise.then返回的
    typeof obj.then === 'function'
  );
}
function inject(target: any, methodName: string, callback: (...args: any[]) => any) {
  if (!target || !methodName || !callback) {
    return console.warn(`注入方法 -->${target} -- ${methodName} --${callback} 失败`);
  }
  Object.defineProperty(target, methodName, {
    writable: true,
    enumerable: false, // 不可枚举
    configurable: true,
    value: callback,
  });
}

// 移除数组中某个元素
inject(Array.prototype, 'remove', function <T>(this: T[], val: T) {
  const index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
  return this;
});
// 数组扁平化
inject(Array.prototype, 'flatten', function (this: any[]) {
  function flatten(arr: any[]): any[] {
    return arr.reduce((a, b) => [].concat(Array.isArray(a) && a ? flatten(a) : a, Array.isArray(b) && b ? flatten(b) : b), []);
  }
  return flatten(this);
});
// 将字符串中的key给整出来，通常用于url里面的key=value value获取
inject(String.prototype, 'query', function (this: string, key) {
  const _result: { [key: string]: any } = {};
  // eslint-disable-next-line no-return-assign
  this.replace(/([^?&=]+)=([^&]+)/g, (_, k, v) => (_result[k] = v));
  return _result[key] || '';
});

/**  去除前后空格 */
inject(String.prototype, 'trim', function (this: string, isGlobal: boolean): string {
  if (isGlobal) {
    // 是否删除所有空格
    return this.replace(/\s/g, '');
  }
  return this.replace(/(^\s*)|(\s*$)/g, '');
});

/** 去除数组为空的项 */
inject(Array.prototype, 'trim', function (this: any[]) {
  if (Array.isArray(this)) {
    return this.filter((i) => i);
  }
  return this;
});

// 是否是手机
inject(String.prototype, 'isMobile', function (this: string): boolean {
  // return /^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/.test(this.trim());
  return /^1[0-9]{10}$/.test(this.trim());
});
// 是否是电话
inject(String.prototype, 'isTel', function (this: string): boolean {
  return /^[014]\d{9,11}$/.test(this.trim());
});

// 是否是email
inject(String.prototype, 'isEmail', function (this: string): boolean {
  return /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(this.trim());
});
// 判断是否为身份证号 支持15位和18位
inject(String.prototype, 'isIdCard', function (this: string): boolean {
  return /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/.test(
    this.trim()
  );
});

// 判断是否为url
inject(String.prototype, 'isUrl', function (this: string): boolean {
  // eslint-disable-next-line no-useless-escape
  return /[-a-zA-Z0-9@:%._\\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i.test(this.trim());
});

/**
 * 手机号空格 19800000000 ===>  198 0000 0000
 */
inject(String.prototype, 'phoneSpace', function (this: string): string {
  return this.replace(/(\d{3})(\d{4})/, '$1 $2 ');
});

/**
   "1" => "01"
   "4" => "04"
   "99" => "99"
  */
inject(String.prototype, 'addLeftZero', function (this: string): string {
  return `00${this}`.slice(-2);
});

/** 格式化Date */
inject(Date.prototype, 'format', function (this: string, mask, utc): string {
  return dateFormat(this, mask, utc);
});

inject(Promise.prototype, 'is', async function (this: any): Promise<any> {
  const is = isPromise(this);
  if (!is) return this;
  try {
    const _this = await this;
    return Promise.resolve(_this);
  } catch (error) {
    console.log('this error', error);
    return Promise.resolve(error);
  }
});
