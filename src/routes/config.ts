import { IRouterConfig } from 'ice';
import home from './modules/home';

const routerList = [...home];

const routerConfig: IRouterConfig[] = [...routerList];

export default routerConfig;
