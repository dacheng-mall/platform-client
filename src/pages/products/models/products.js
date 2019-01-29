import _ from 'lodash';
import { getProducts, updateProducts } from '../services';

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
    *setStatus({ id, status }, { call, put, select }) {
      const { data: res } = yield call(updateProducts, { id, status: status ? 1 : 0 });
      if (res) {
        const { data } = yield select(({ products }) => products);
        _.find(data, ['id', res.id]).status = res.status;
        yield put({
          type: 'upState',
          payload: { data: [...data] },
        });
      }
    },
  },
  reducers: {
    upState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
