import { api_test } from '@/api/home';
import Guide from '@/components/Guide';
import TestComponents from '@/components/TestComponents';
import { message } from 'antd';
import classNames from 'classnames';
import { useEffect } from 'react';
import styles from './index.modules.scss';

const Home = () => {
  useEffect(() => {
    getApi();
  }, []);
  const getApi = async () => {
    try {
      const result = await api_test({ name: 'ccw' });
    } catch (error) {
      message?.error({ content: error });
      console.error(`${error}`);
      throw Error(`${error}`);
    }
  };
  return (
    <>
      <Guide />
      <div className={classNames(styles?.test)}></div>
      <TestComponents></TestComponents>
    </>
  );
};

export default Home;
