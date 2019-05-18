import _ from 'lodash';
import { message } from 'antd';
import { fetch as get, update, find } from '../services/activity';

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
        if (pathname === '/instActivity') {
          dispatch({ type: 'initWithInstitution', payload: { ...PAGE_DEF } });
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
    *initWithInstitution({ payload }, { put }) {
      yield put({
        type: 'fetch',
        payload,
        isInstitutionAdmin: true,
      });
    },
    *fetch({ payload, isInstitutionAdmin }, { put, call, select }) {
      const { keywords } = yield select(({ activities }) => activities);
      const params = { ...PAGE_DEF, ...payload, name: keywords };
      // if(isInstitutionAdmin) {
      //   const { user } = yield select(({ app }) => app);
      // }
      const { data } = yield call(get, params);
      yield put({
        type: 'upState',
        payload: { ...data, isInstitutionAdmin },
      });
    },
  },
  reducers: {
    upState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
