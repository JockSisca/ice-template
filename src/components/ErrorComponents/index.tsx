import { LoadingOutlined } from '@ant-design/icons';
import { Button, Result, Spin } from 'antd';
import { history } from 'ice';

/** 404 */
export const NotFoundComponent = () => (
  <div className="middle-page-center">
    <Result
      status="404"
      title="404"
      subTitle="抱歉，当前访问的页面不存在。"
      extra={
        <Button type="primary" onClick={() => history?.replace('/home/team-card')}>
          返回首页
        </Button>
      }
    />
  </div>
);

/** 跳转发生错误 */
export const ErrorComponent = () => (
  <div className="middle-page-center">
    <Result
      status="500"
      title="错误"
      subTitle="页面发生了点故障，可能是页面已经更新新版本，请尝试刷新页面！"
      extra={
        <Button type="primary" onClick={() => location.reload()}>
          刷新页面
        </Button>
      }
    />
  </div>
);
const antIcon = <LoadingOutlined style={{ fontSize: 35 }} spin />;
/** 跳转发生错误 */
export const LoadingComponent = () => (
  <div className="middle-page-center">
    <Spin spinning indicator={antIcon} tip="..."></Spin>
  </div>
);
