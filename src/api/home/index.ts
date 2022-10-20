import { get, post } from '@/utils/http';
import { ITest } from './index.i';

/**
 * @description 接口描述
 * @link 接口文档地址
 */
export const api_test = (params: ITest.Parma) => {
  return post<ITest.Data>('/test', params);
};
