import _ from 'lodash';
import { message } from 'antd';
import { fetch as get, update, find } from '../services';

const PAGE_DEF = { page: 1, pageSize: 10 };

export default {
  namespace: 'activities',
  state: {
    data: [],
    pagination: PAGE_DEF,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/activities') {
          dispatch({ type: 'init', payload: { ...PAGE_DEF } });
        }
      });
    },
  },
  effects: {
    *init({ payload }, { put }) {
      yield put({
        type: 'fetch',
        payload,
      });
    },
    *fetch({ payload }, { put, call, select }) {
      const { keywords } = yield select(({ activities }) => activities);
      const { data } = yield call(get, { ...PAGE_DEF, ...payload, name: keywords});
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
