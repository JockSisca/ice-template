// import { ConfigProvider } from 'antd'; // 普通的项目用这个
import { IAppConfig, runApp } from 'ice';
import { ConfigProvider } from '@alifd/next'; // 微前端用这个
import zhCN from 'antd/lib/locale/zh_CN';
import './utils/inject';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { ErrorComponent, NotFoundComponent } from './components/ErrorComponents';
import PageLoading from './components/PageLoading';

const appConfig: IAppConfig = {
  app: {
    auth: {
      NoAuthFallback: <div>没有权限...</div>,
    },
    rootId: 'ice-container',
    errorBoundary: true, // 是否开启 ErrorBoundary，默认为 false
    // 自定义错误的处理事件
    onErrorBoundaryHandler: (error: Error, componentStack: string) => {
      // Do something with the error
      console.error('onErrorBoundaryHandler', error, componentStack);
    },
    ErrorBoundaryFallback: () => {
      return <ErrorComponent></ErrorComponent>;
    }, // 页面报错的情况
    addProvider: (payload) => {
      console.log('addProvider1', payload);
      return (
        <Provider store={store}>
          {/* <ConfigProvider locale={zhCN}>{payload.children}</ConfigProvider> 普通项目用这个 */}
          <ConfigProvider prefix="next-icestark-">{payload.children}</ConfigProvider>
          {/* 微前端用这个 */}
        </Provider>
      );
    },
    icestark: {
      getApps: async () => {
        const apps = [];
        return apps;
      },
    },
  },
  router: {
    type: 'browser',
    basename: BASENAME,
    fallback: <PageLoading></PageLoading>,
  },
};

runApp(appConfig);
