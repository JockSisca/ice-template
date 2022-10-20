import { init, RematchDispatch, RematchRootState } from '@rematch/core';
import immerPlugin from '@rematch/immer';
import { models, RootModel } from './modules';
import selectPlugin from '@rematch/select'; // 添加getter操作
import loadingPlugin, { ExtraModelsFromLoading } from '@rematch/loading'; // 对每一个model中的effects自动添加loading状态。

type FullModel = ExtraModelsFromLoading<RootModel, { type: 'full' }>;

export const store = init<RootModel, FullModel>({
  models,
  plugins: [
    immerPlugin({}), // 让你的操作变得更简洁 详情请见 https://zhuanlan.zhihu.com/p/398805042
    // 给你的每一个effect加上loading http://www.javashuo.com/article/p-dfsqatqv-nc.html
    loadingPlugin({
      type: 'full',
    }),
    selectPlugin(), // 让你可以做计算属性 https://rematchjs.org/docs/plugins/select/#3-selector-examples
  ],
});

export const { select } = store;
export type Store = typeof store;
export type RootDispatch = RematchDispatch<RootModel>;
export type RootState = RematchRootState<RootModel>;
