import { createModel } from '@rematch/core';
import type { RootModel } from '.';

interface Test {
  test: number;
}
export const home = createModel<RootModel>()({
  state: {
    test: 0,
  } as Test,
  reducers: {
    setTest(prevState, payload: Partial<number>) {
      prevState.test += payload;
    },
  },
  effects: (dispatch) => ({
    async setHomeState() {
      try {
        dispatch?.home?.setTest(1);
      } catch (error) {
        throw new Error(`${error}`);
      }
    },
    async setHomeStates(number) {
      try {
        dispatch?.home?.setTest(number);
      } catch (error) {
        throw new Error(`${error}`);
      }
    },
  }),
});
