// import _ from 'lodash';
import { getLogisticsTemplate } from '../services';

const PAGE_DEF = { page: 1, pageSize: 8 };

export default {
  namespace: 'logistics',
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/trade/logistics') {
          dispatch({ type: 'init', payload: { ...PAGE_DEF } });
        }
      });
    },
  },
  state: {},
  effects: {
    *init(p, { select, put }) {
      const { pagination, data } = yield select(({ tickets }) => tickets);
      if (data.length < 1) {
        yield put({
          type: 'fetch',
          payload: { ...pagination },
        });
      }
    },
    *fetch({ payload }, { put, call, select }) {
      try {
        debugger
        const { query } = yield select(({ tickets }) => tickets);
        const { data } = yield call(getLogisticsTemplate, { ...payload, query });
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
