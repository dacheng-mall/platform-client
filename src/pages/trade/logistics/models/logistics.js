// import _ from 'lodash';
import { getTemplates } from '../services';

const PAGE_DEF = { page: 1, pageSize: 8 };

export default {
  namespace: 'logistics',
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/trade/logistics-template') {
          dispatch({ type: 'init', payload: { ...PAGE_DEF } });
        }
      });
    },
  },
  state: {
    pagination: { ...PAGE_DEF },
    data: [],
  },
  effects: {
    *init(p, { select, put }) {
      const { pagination, data } = yield select(({ logistics }) => logistics);
      if (data.length < 1) {
        yield put({
          type: 'fetch',
          payload: { ...pagination },
        });
      }
    },
    *fetch({ payload = {} }, { put, call, select }) {
      try {
        const { query } = yield select(({ logistics }) => logistics);
        console.log(query);
        const { data } = yield call(getTemplates, { ...payload, query });
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
