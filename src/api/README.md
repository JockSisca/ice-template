接口储存处

一级目录为接口一级，后面的以接口名为准

例子：

接口 url: https:xxx.com/api/aaa/bbb/ccc/ddd

文件名：aaa

文件： aaa.ts

接口： aaa.i.ts

方法： function api_ccc_ddd

外部引入：

输入 api_ 提示对应接口，并且点击回车，自动引入


ts生成
将接口文档中的json数据结构复制到json2ts
http://www.json2ts.com/

生成后采用:
接口前缀为大写I开头后缀为接口名
例如接口函数名：api_abc_def 那么接口名为IAbcDef

```typescript
export declare namespace IAbcDef {
  export interface Params {
    // 传入的数据
  }
  export interface Data {
    some_params: string;
  }
}

// 接口函数处使用
export const api_abc_def = (params: IAbcDef.Params) => {
  return post<IAbcDef.Data>('/xxx/abc/def', params);
};

```