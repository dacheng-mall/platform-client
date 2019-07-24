import _ from 'lodash';
import { message } from 'antd';
import {
  getInst,
  removeInst,
  updateInst,
  createInst,
  getInstWithoutPage,
  getInstitutionsForInstAdminWhitoutPage,
  getInstitutionsWhitoutPage,
} from '../services';
import { fieldsChange } from '../../../../utils/ui';

const PAGE_DEF = { page: 1, pageSize: 8 };
const INIT_EDITOR = {
  editor: null,
  errors: {},
};
export default {
  namespace: 'institution',
  state: {
    data: [],
    pagination: PAGE_DEF,
    ...INIT_EDITOR,
    parents: [],
    keywords: '',
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/institution/list') {
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
      const { keywords: name, institutionId: pid } = yield select(({ institution }) => institution);
      const parmas = {};
      if (pid) {
        parmas.pid = pid;
      } else {
        delete parmas.pid;
      }
      if (name) {
        parmas.name = name;
      } else {
        delete parmas.name;
      }
      const { data } = yield call(getInst, { ...PAGE_DEF, ...payload, ...parmas });
      yield put({
        type: 'upState',
        payload: data,
      });
    },
    *edit({ payload }, { call, put, select }) {
      const { editor } = yield select(({ institution }) => institution);
      if (payload.regionId) {
        payload.regionId = payload.regionId.join(',');
        payload.regionName = editor.regionName;
      }
      if (payload.status) {
        payload.status = 1;
      } else {
        payload.status = 0;
      }
      if (!payload.pid) {
        delete payload.pid;
      }
      if (editor.id) {
        payload.id = editor.id;
        yield call(updateInst, payload);
      } else {
        payload.status = 1;
        yield call(createInst, payload);
      }
      const { pagination } = yield select(({ institution }) => institution);
      yield put({
        type: 'fetch',
        payload: pagination,
      });
      yield put({
        type: 'closeEditor',
      });
    },
    *remove({ id }, { call, put, select }) {
      const { data } = yield call(removeInst, id);
      if (data) {
        const list = yield select(({ institution }) => institution.data);
        const newList = _.filter(list, ({ id }) => id !== data.id);
        yield put({
          type: 'upState',
          payload: {
            data: [...newList],
          },
        });
        yield put({
          type: 'closeEditor',
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
          parents: data,
        },
      });
    },
    *closeEditor(p, { put }) {
      yield put({
        type: 'upState',
        payload: INIT_EDITOR,
      });
    },
    *changeStatus({ payload }, { call, put, select }) {
      const { data } = yield call(updateInst, payload);
      if (data) {
        message.success('状态更新成功');
        const list = yield select(({ institution }) => institution.data);
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
