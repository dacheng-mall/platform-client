import _ from 'lodash';
import { message } from 'antd';
import { getUsers, getUser, removeUser } from '../services';

const PAGE_DEF = { page: 1, pageSize: 8 };

export default {
  namespace: 'customer',
  state: {
    data: [],
    pagination: PAGE_DEF,
    editor: null,
    errors: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/users/customer') {
          dispatch({ type: 'init', payload: PAGE_DEF });
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
    *fetch({ payload }, { put, call }) {
      const { data } = yield call(getUsers, {...PAGE_DEF, ...payload, userType: 2});
      yield put({
        type: 'upState',
        payload: data,
      });
    },
    *remove({ id }, { call, put, select }) {
      const { data } = yield call(removeUser, id);
      if (data) {
        const list = yield select(({ customer }) => customer.data);
        const newList = _.filter(list, ({ id }) => id !== data);
        yield put({
          type: 'upState',
          payload: {
            data: [...newList],
          },
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
