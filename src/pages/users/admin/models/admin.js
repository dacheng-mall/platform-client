import _ from 'lodash';
import { getAdmins, createAdmin, updateAdmin, removeAdmin, getAdmin } from '../services';
import { fieldsChange } from '../../../../utils/ui';
import { message } from 'antd';

const PAGE_DEF = { page: 1, pageSize: 10 };

export default {
  namespace: 'admin',
  state: {
    data: [],
    pagination: PAGE_DEF,
    editor: null,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/users/admin') {
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
      const { data } = yield call(getAdmins, payload || PAGE_DEF);
      yield put({
        type: 'upState',
        payload: data,
      });
    },

    *create(p, { put, call, select }) {
      const { editor, pagination, data: oldData } = yield select(({ admin }) => admin);
      let res;
      delete editor.createTime;
      editor.roles = editor.roles.join(',');
      if (editor.id) {
        const { data } = yield call(updateAdmin, editor);
        res = data;
      } else {
        const { data } = yield call(createAdmin, editor);
        res = data;
      }
      if (res) {
        message.success(`${editor.id ? '编辑' : '新建'}成功`);
        const { data } = yield call(getAdmin, res);
        console.log(data);
        yield put({
          type: 'upState',
          payload: {
            editor: null,
          },
        });
      }
    },
    *remove({ id }, { call, put }) {
      const { data } = yield call(removeAdmin, id);
      console.log(data);
    },
  },
  reducers: {
    upState(state, { payload }) {
      return { ...state, ...payload };
    },
    fieldsChange,
  },
};
