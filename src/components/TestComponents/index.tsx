import { RootDispatch, RootState } from '@/store/store';
import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import styles from './index.modules.scss';

const TestComponents = () => {
  const dispatch = useDispatch<RootDispatch>();
  const {
    home: { test },
  } = useSelector((state: RootState) => {
    return state;
  });

  return (
    <>
      {test}
      <Button
        onClick={() => {
          dispatch?.home?.setHomeState();
        }}>
        +
      </Button>

      <Button
        onClick={() => {
          dispatch?.home?.setHomeStates(2);
        }}>
        +2
      </Button>
    </>
  );
};

export default TestComponents;
