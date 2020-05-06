import _ from 'lodash';
import { message } from 'antd';
import moment from 'moment';
import {
  getAdmins,
  updateAdmin,
  removeAdmin,
  createAdmin,
  getInstWithoutPage,
  getInstitutionsWhitoutPage,
  getInstitutionsForInstAdminWhitoutPage,
  exportCSV,
} from '../services';

import { parseEditor } from '../../../../utils/ui';

const PAGE_DEF = { page: 1, pageSize: 8 };
const DEF_QUERY = {
  range: undefined,
  name: undefined,
  code: undefined,
  mobile: undefined,
  institutionId: undefined,
};

export default {
  namespace: 'seller',
  state: {
    data: [],
    pagination: PAGE_DEF,
    editor: null,
    errors: {},
    inst: [],
    ...DEF_QUERY,
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
    *fetch({ payload }, { put, call, select }) {
      const { range, institutionId, name, code, mobile } = yield select(({ seller }) => seller);
      const params = {};
      if (range && range.length > 0) {
        params.from = moment(range[0]).format('YYYY-MM-DD 00:00:00');
        params.to = moment(range[1]).format('YYYY-MM-DD 23:59:59');
      }
      if (institutionId) {
        params.institutionId = institutionId;
      }
      if (name) {
        params.name = name;
      }
      if (code) {
        params.code = code;
      }
      if (mobile) {
        params.mobile = mobile;
      }
      const { data } = yield call(getAdmins, { ...payload, ...params, userType: 4 });

      data.data = _.map(data.data, (d) => {
        d.institutionName = d.institution.name;
        return d;
      });
      yield put({
        type: 'upState',
        payload: data,
      });
    },
    *editUser({ payload }, { call, select, put }) {
      const { editor, pagination } = yield select(({ seller }) => seller);
      let res;

      const values = parseEditor(payload);
      console.log(values, payload);
      if (editor.id) {
        const { data } = yield call(updateAdmin, { ...editor, ...values });
        res = data;
      } else {
        editor.userType = 1;
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
        const list = yield select(({ seller }) => seller.data);
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
    *fetchInst({ payload }, { put, select, call }) {
      const { userType, institutionId: id } = yield select(({ app }) => app.user);
      let data;
      if (userType === 3) {
        // 机构管理员查子机构
        const res = yield call(getInstitutionsForInstAdminWhitoutPage, { ...payload, id });
        data = res.data;
      } else if (userType === 1) {
        // 平台管理员查全部
        const res = yield call(getInstitutionsWhitoutPage, payload);
        data = res.data;
      }
      yield put({
        type: 'upState',
        payload: {
          institutions: data,
        },
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
    *exportCSV(p, { select, call }) {
      const { institutionId } = yield select(({ seller }) => seller);
      // console.log('inst', inst);
      const data = yield call(exportCSV, { id: institutionId });
    },
  },
  reducers: {
    upState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
