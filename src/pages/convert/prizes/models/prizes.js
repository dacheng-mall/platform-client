import _ from 'lodash';
import { getPrizes } from '../service';

const PAGE_DEF = { page: 1, pageSize: 6 };

export default {
  namespace: 'prizes',
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/convert/prizes') {
          dispatch({ type: 'init' });
        }
      });
    },
  },
  state: {
    pagination: { ...PAGE_DEF },
    data: [],
  },
  effects: {
    *init(p, { put, select }) {
      const { pagination, data } = yield select(({ prizes }) => prizes);
      if (data.length < 1) {
        yield put({
          type: 'fetch',
          payload: { ...pagination },
        });
      }
    },
    *fetch({ payload }, { put, call }) {
      try {
        const { data } = yield call(getPrizes, payload);
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
