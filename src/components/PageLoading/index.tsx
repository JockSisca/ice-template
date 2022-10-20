import { Spin } from 'antd';
import classNames from 'classnames';
import styles from './index.modules.scss';

const PageLoading = () => {
  return (
    <div className={classNames('loading-container')}>
      <Spin></Spin>
    </div>
  );
};

export default PageLoading;
