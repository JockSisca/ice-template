import { lazy } from 'ice';

export function lazyPage(dynamicImport: any): any {
  // vite模式打包下不支持这种
  console.log('这是获取全局', window);

  console.log(BASENAME);
  console.log(RUNTIME_TYPE);

  if (RUNTIME_TYPE === 'vite') {
    // 如果是在src/router.ts文件中，vite会自动给lazy方法的数据添加一个true，但其他位置的文件里面不会自动添加，就会报错
    return lazy(dynamicImport, true);
  } else {
    return lazy(dynamicImport);
  }
}
