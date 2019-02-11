import _ from 'lodash';
import { getProducts, updateProducts, removeProduct } from '../services';

const DEFAULT_PAGE = {
  page: 1,
  pageSize: 10
}

export default {
  namespace: 'products',
  state: {
    data: [],
    pagination: DEFAULT_PAGE
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        switch (pathname) {
          case '/products/self': {
            dispatch({ type: 'fetch', paylaod: 'self' });
            break;
          }
          case '/products/third': {
            dispatch({ type: 'fetch', paylaod: 'third' });
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
    *fetch({ payload = DEFAULT_PAGE }, { put, call, select }) {
      const { data } = yield call(getProducts, payload);
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
    *remove({id}, {call, put, select}){
      yield call(removeProduct, id);
      const {data} = yield select(({products}) => products);
      const newList = _.filter(data, ({ id: pid }) => id !== pid);
      yield put({
        type: 'upState',
        payload: {
          data: [...newList]
        }
      })
    }
  },
  reducers: {
    upState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
