import IsLoginComponents from '@/routes/middlewares/IsLoginComponents';
import { IRouterConfig } from 'ice';
import { lazyPage } from '../lazy';

const Home = lazyPage(() => import(/* webpackChunkName: 'Home' */ '@/pages/Home/index')); // 请务必这么引入

const routerConfig: IRouterConfig[] = [
  {
    path: '/',
    component: Home,
    wrappers: [IsLoginComponents],
  },
];

export default routerConfig;
