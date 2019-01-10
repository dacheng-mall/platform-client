import { getProducts } from '../services';

const DEFAULT_PAGE = {
  page: 1,
  pageSize: 10
}

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
    *init({ paylaod = DEFAULT_PAGE }, { put, call, select }) {
      const { data } = yield call(getProducts, paylaod);
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
