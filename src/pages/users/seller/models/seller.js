import _ from 'lodash';
import { message } from 'antd';
import { getAdmins, updateAdmin, removeAdmin, getInstWithoutPage } from '../services';

const PAGE_DEF = { page: 1, pageSize: 8 };

export default {
  namespace: 'seller',
  state: {
    data: [],
    pagination: PAGE_DEF,
    editor: null,
    errors: {},
    inst: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/users/seller') {
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
      const { data } = yield call(getAdmins, { ...PAGE_DEF, ...payload, userType: 4 });
      yield put({
        type: 'upState',
        payload: data,
      });
    },
    *remove({ id }, { call, put, select }) {
      const { data } = yield call(removeAdmin, id);
      if (data) {
        const list = yield select(({ admin }) => admin.data);
        const newList = _.filter(list, ({ id }) => id !== data);
        yield put({
          type: 'upState',
          payload: {
            data: [...newList],
          },
        });
      }
    },
    *changeStatus({ payload }, { call, put, select }) {
      const { data } = yield call(updateAdmin, payload);
      if (data) {
        message.success('状态更新成功');
        const list = yield select(({ admin }) => admin.data);
        const newList = _.map(list, (item) => {
          if (item.id === data.id) {
            item.status = payload.status;
          }
          return item;
        });
        yield put({
          type: 'upState',
          payload: {
            data: newList,
          },
        });
      }
    },
    *searchByKeywords({ payload }, { call, put }) {
      yield put({
        type: 'upState',
        payload: {
          keywords: payload,
        },
      });
      yield put({
        type: 'fetch',
      });
    },
    *searchInst({ payload }, { call, put }) {
      const { data } = yield call(getInstWithoutPage, { name: payload });
      yield put({
        type: 'upState',
        payload: {
          inst: data,
        },
      });
    },
  },
  reducers: {
    upState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
