import { getProducts } from '../services';

export default {
  namespace: 'products',
  state: {
    list: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        switch (pathname) {
          case '/products/self': {
            dispatch({ type: 'init', paylaod: 'self' });
            break;
          }
          case '/products/third': {
            dispatch({ type: 'init', paylaod: 'third' });
            break;
          }
          default: {
            break;
          }
        }
      });
    },
  },

  effects: {
    *init({ paylaod }, { put, call, select }) {
      const { data } = yield call(getProducts);
      yield put({
        type: 'upState',
        payload: data,
      });
    },
  },
  reducers: {
    upState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
