import { Models } from '@rematch/core';
import { home } from './home';

export interface RootModel extends Models<RootModel> {
  home: typeof home;
}

export const models: RootModel = {
  home,
};
