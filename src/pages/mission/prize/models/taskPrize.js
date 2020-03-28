import _ from 'lodash';
import { fetchPrizes, updatePrize } from '../services';

const PAGE_DEF = { page: 1, pageSize: 6 };

export default {
  namespace: 'taskPrize',
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/mission/prize') {
          dispatch({ type: 'init' });
        }
      });
    },
  },
  state: {
    pagination: { ...PAGE_DEF },
    data: [],
    query: {}
  },
  effects: {
    *init(p, { put, select }) {
      const { pagination, data } = yield select(({ taskPrize }) => taskPrize);
      if (data.length < 1) {
        yield put({
          type: 'fetch',
          payload: { ...pagination },
        });
      }
    },
    *update({ payload }, { call, put, select }) {
      const { data } = yield call(updatePrize, payload);
      if (data.result === 'updated') {
        const { data: _data } = yield select(({ taskPrize }) => taskPrize);
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
        const { data } = yield call(fetchPrizes, payload);
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
