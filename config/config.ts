import { findSync } from './tools';
import proxy from './proxy';
import path from 'path';

const fileNames = findSync('../src/assets/global'); // 拿到global里面的所有文件路径
const prodPubilcPath = process.env.PUBLIC_URL; // 用于配置cdn
const cssGlobal = fileNames.map((filename) => `@import "${filename}";`.replace(/\\/g, '/')).join('');
const env = process.env.NODE_ENV; // production development
const isDev = env !== 'production';
const isVite = false && isDev; // 是否开启vite模式
console.log('runtime:', isVite ? 'vite' : 'webpack');
const BASENAME = 'CCWWEBPACK';
import selfConfig from './selfConfig';

const envPath = isDev
  ? {
      publicPath: 'http://localhost:10080/', // 本地调试微前端，需要这么处理
      devPublicPath: 'http://localhost:10080/', // 本地调试微前端，需要这么处理
    }
  : {};
const htmlOptions = [
  {
    addjs: [],
    addcss: [],
    title: '1111',
  },
]; // cdn的引入直接写这里配合externals一起用

const config = {
  // ...envPath,
  // // 这些包排除在外
  // externals: {
  //   react: 'React',
  //   'react-dom': 'ReactDOM',
  //   'react-router-dom': 'ReactRouterDOM',
  //   axios: 'axios',
  // },
  eslint: true, // 使用eslint
  hash: true, // 资源hash
  define: {
    // 默认的全局变量
    BASENAME: BASENAME, // 项目名字
    RUNTIME_TYPE: isVite ? 'vite' : 'webpack',
  },
  sourceMap: false, // sourcemap关闭
  sassLoaderOptions: {
    prependData: cssGlobal, // 全局注入的css
    sourceMap: false,
  }, // sassloader的配置
  postcssrc: true, // 关闭工程默认的postcss配置 找项目中postcss.config.js
  proxy, // 代理
  vite: isVite, // 是否是vite
  store: false, // 是否开启预编译 注：和vue一样会产生大量文件，在http2.0开启
  modeConfig: {
    dbg: {},
    dev: {},
    prod: {},
  },
  router: true,
  webpackPlugins: {
    HtmlWebpackPlugin: {
      template: path.resolve(__dirname, '../public/index.html'),
    },
  },
  plugins: [
    // [
    //   'build-plugin-icestark',
    //   isVite
    //     ? { type: 'child' }
    //     : {
    //         type: 'child',
    //         umd: true,
    //       },
    // ], // umd引入方式优化 这是纯单独一个项目的情况

    [
      'build-plugin-icestark',
      {
        type: 'framework',
        // 防止与微应用的 webpackJSONP 冲突
        uniqueName: 'frameworkJsonp',
      },
    ],
    [
      'build-plugin-fusion',
      {
        themeConfig: {
          // 防止与微应用里的基础组件 css prefix 冲突
          'css-prefix': 'next-icestark-',
        },
      },
    ], // 如果是微前端请用这一段 (基座)

    [
      'build-plugin-ignore-style',
      {
        libraryName: 'antd',
      },
    ], // antd优化 https://ice.work/docs/plugin/list/ignore-style
    selfConfig,
  ],
};

module.exports = config;
