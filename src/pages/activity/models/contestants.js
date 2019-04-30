import ptrx from 'path-to-regexp';

export default {
  namespace: 'contestants',
  state: {},
  subscription: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/activity/:id/contestants') {
        }
      });
    },
  },
  effects: {},
  reducers: {
    upState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
