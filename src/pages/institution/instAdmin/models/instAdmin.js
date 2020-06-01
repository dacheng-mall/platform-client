import _ from 'lodash';
import { message } from 'antd';
import { getAdmins, removeAdmin, updateAdmin, createAdmin, getInstWithoutPage } from '../services';
import { fieldsChange } from '../../../../utils/ui';

const PAGE_DEF = { page: 1, pageSize: 8 };
const INIT_EDITOR = {
  editor: null,
  errors: {},
};

export default {
  namespace: 'instAdmin',
  state: {
    data: [],
    pagination: { ...PAGE_DEF },
    ...INIT_EDITOR,
    inst: [],
    keywords: '',
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/institution/instAdmin') {
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
      const { keywords } = yield select(({ instAdmin }) => instAdmin);
      const { data } = yield call(getAdmins, { ...PAGE_DEF, ...payload, name: keywords });
      yield put({
        type: 'upState',
        payload: data,
      });
    },
    *resetPW({ payload }, { call }) {
      const { id, username } = payload;
      yield call(updateAdmin, { id, username, password: '111111' });
    },
    *edit({ payload }, { call, put, select }) {
      const { editor, inst } = yield select(({ instAdmin }) => instAdmin);
      if (payload.status) {
        payload.status = 1;
      } else {
        payload.status = 0;
      }
      if (payload.institutionId) {
        const target = _.find(inst, ['id', payload.institutionId]);
        if (target && target.name) {
          payload.institutionName = target.name;
        }
      }
      if (editor.id) {
        payload.id = editor.id;
        yield call(updateAdmin, payload);
      } else {
        payload.status = 1;
        payload.userType = 3;
        yield call(createAdmin, payload);
      }
      const { pagination } = yield select(({ instAdmin }) => instAdmin);
      yield put({
        type: 'fetch',
        payload: pagination,
      });
      yield put({
        type: 'closeModal',
      });
    },
    *remove({ id }, { call, put, select }) {
      const { data } = yield call(removeAdmin, id);
      if (data) {
        const list = yield select(({ instAdmin }) => instAdmin.data);
        const newList = _.filter(list, ({ id }) => id !== data.id);
        yield put({
          type: 'upState',
          payload: {
            data: [...newList],
          },
        });
        yield put({
          type: 'closeModal',
        });
      }
    },
    *closeModal(p, { put }) {
      yield put({
        type: 'upState',
        payload: INIT_EDITOR,
      });
    },
    *searchByKeywords({ payload }, { put }) {
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
      const { data } = yield call(getInstWithoutPage, payload);
      yield put({
        type: 'upState',
        payload: {
          inst: data,
        },
      });
    },
    *changeStatus({ payload }, { call, put, select }) {
      const { data } = yield call(updateAdmin, payload);
      if (data) {
        message.success('状态更新成功');
        const list = yield select(({ instAdmin }) => instAdmin.data);
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
  },
  reducers: {
    upState(state, { payload }) {
      return { ...state, ...payload };
    },
    fieldsChange,
  },
};
