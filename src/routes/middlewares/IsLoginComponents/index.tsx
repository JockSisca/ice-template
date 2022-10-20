import { ComponentType, ReactElement, useEffect, useState } from 'react';

const IsLoginComponents = (WrappedComponent) => {
  const Wrapped = (props: any) => {
    console.log('LoginWrapper', props);
    const [isLogin, setIsLogin] = useState<boolean>(true);
    useEffect(() => {
      // 经过系列操作更改isLogin
      setIsLogin(true);
    }, []);
    return isLogin ? (
      <>
        <WrappedComponent {...props}></WrappedComponent>
      </>
    ) : (
      <div></div>
    );
  };
  return Wrapped;
};
export default IsLoginComponents;
