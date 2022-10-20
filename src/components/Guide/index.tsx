import { Button } from 'antd';
import classNames from 'classnames';
import styles from './index.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootDispatch, RootState } from '@/store/store';

const Guide = () => {
  const dispatch = useDispatch<RootDispatch>();
  const home = useSelector<RootState>((state) => {
    return state?.home?.test;
  });
  return (
    <div className={classNames(styles.container)}>
      <h2 className={classNames(styles.title)}>Welcome to icejs!{home}</h2>

      <p className={classNames(styles.description)}>This i111asdasdas a awe some project, enjoy it!</p>

      <div className={classNames(styles.action)}>
        <a
          href="https://ice.work/docs/guide/about"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            marginRight: 20,
          }}>
          使用文档
        </a>
        <a href="https://github.com/ice-lab/icejs" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </div>
      <Button
        onClick={() => {
          dispatch?.home?.setHomeState();
        }}>
        +
      </Button>
    </div>
  );
};

export default Guide;
