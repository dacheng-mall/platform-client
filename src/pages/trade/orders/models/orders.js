import _ from 'lodash';

const PAGE_DEF = {page: 1, pageSize: 8}

export default {
  namespace: 'orders',
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/trade/orders') {
          dispatch({ type: 'init', payload: { ...PAGE_DEF } });
        }
      });
    },
  },
  state: {},
  effects: {
    *init({ payload }, { call }) {
      
    },
  },
  reducers: {
    upState: (state, { payload }) => {
      return { ...state, ...payload };
    },
  },
};
