import _ from 'lodash';
import { message } from 'antd';
import { getAdmins, createAdmin, updateAdmin, removeAdmin } from '../services';
import { parseEditor } from '../../../../utils/ui';

const PAGE_DEF = { page: 1, pageSize: 10 };

export default {
  namespace: 'instAdminForinst',
  state: {
    data: [],
    pagination: PAGE_DEF,
    editor: null,
    errors: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/instUser/instAdmin') {
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
      const {
        user: { institutionId },
      } = yield select(({ app }) => app);
      const { data } = yield call(getAdmins, { ...PAGE_DEF, ...payload, userType: 3, institutionId });
      yield put({
        type: 'upState',
        payload: data,
      });
    },
    *editUser({ payload }, { call, select, put }) {
      if (payload.username === 'adm') {
        message.warning('不能修改管理员的信息');
        return false;
      }
      const { editor, pagination } = yield select(({ instAdminForinst }) => instAdminForinst);
      let res;
      delete editor.createTime;

      const values = parseEditor(payload);
      if (editor.id) {
        const { data } = yield call(updateAdmin, { ...editor, ...values });
        res = data;
      } else {
        editor.userType = 2;
        const { data } = yield call(createAdmin, { ...editor, ...values });
        res = data;
      }
      if (res) {
        yield put({
          type: 'fetch',
          payload: {
            ...pagination,
            userType: 1,
          },
        });
        yield put({
          type: 'upState',
          payload: {
            editor: null,
          },
        });
      }
    },
    *remove({ id }, { call, put, select }) {
      const { data } = yield call(removeAdmin, id);
      if (data) {
        const list = yield select(({ instAdminForinst }) => instAdminForinst.data);
        const newList = _.filter(list, ({ id }) => id !== data);
        yield put({
          type: 'upState',
          payload: {
            data: [...newList],
          },
        });
      }
    },
    *resetPW({ payload }, { call }) {
      const { id, username } = payload;
      yield call(updateAdmin, { id, username, password: '111111' });
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
  },
  reducers: {
    upState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
