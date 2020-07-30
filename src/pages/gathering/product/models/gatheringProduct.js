import _ from 'lodash';
import { fetchProducts, updateProduct } from '../services';

const PAGE_DEF = { page: 1, pageSize: 10 };

export default {
  namespace: 'gatheringProduct',
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/gathering/product') {
          dispatch({ type: 'init' });
        }
      });
    },
  },
  state: {
    pagination: { ...PAGE_DEF },
    data: [],
    query: {},
  },
  effects: {
    *init(p, { put, select }) {
      const { pagination, data } = yield select(({ gatheringProduct }) => gatheringProduct);
      if (data.length < 1) {
        yield put({
          type: 'fetch',
          payload: { ...pagination },
        });
      }
    },
    *update({ payload }, { call, put, select }) {
      console.log(payload);
      const { data } = yield call(updateProduct, payload);
      if (data.result === 'updated') {
        const { data: _data } = yield select(({ gatheringProduct }) => gatheringProduct);
        const index = _.findIndex(_data, ['id', payload.id]);
        _data[index].status = payload.status;
        yield put({
          type: 'upState',
          payload: {
            data: [..._data],
          },
        });
      }
    },
    *fetch({ payload }, { put, call }) {
      try {
        const { data } = yield call(fetchProducts, payload);
        yield put({
          type: 'upState',
          payload: {
            ...data,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
  reducers: {
    upState: (state, { payload }) => {
      return { ...state, ...payload };
    },
  },
};
