// import _ from 'lodash';
import { getCompanies } from '../services';

const PAGE_DEF = { page: 1, pageSize: 8 };

export default {
  namespace: 'logisticCompanies',
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/trade/logistic-companies') {
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
      const { pagination, data } = yield select(({ logisticCompanies }) => logisticCompanies);
      if (data.length < 1) {
        yield put({
          type: 'fetch',
          payload: { ...pagination },
        });
      }
    },
    *fetch({ payload = {} }, { put, call, select }) {
      console.log('----')
      try {
        const { query } = yield select(({ logisticCompanies }) => logisticCompanies);
        console.log(query);
        const { data } = yield call(getCompanies, { ...payload, query });
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
