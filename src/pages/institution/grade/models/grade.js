import _ from 'lodash';
import { message } from 'antd';
import { fetch as get, remove, update, create, find, findInst } from '../services';
import { fieldsChange } from '../../../../utils/ui';

const PAGE_DEF = { page: 1, pageSize: 8 };
const INIT_EDITOR = {
  editor: null,
  errors: {},
};

export default {
  namespace: 'grade',
  state: {
    data: [],
    pagination: PAGE_DEF,
    ...INIT_EDITOR,
    inst: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/institution/grade') {
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
      const { keywords } = yield select(({ grade }) => grade);
      const { data } = yield call(get, { ...PAGE_DEF, ...payload, name: keywords });
      yield put({
        type: 'upState',
        payload: data,
      });
    },
    *edit({ payload }, { call, put, select }) {
      const { editor } = yield select(({ grade }) => grade);
      if (payload.status) {
        payload.status = 1;
      } else {
        payload.status = 0;
      }
      if (payload.institution) {
        const [institutionId, institutionCode] = payload.institution.split(',');
        payload.institutionId = institutionId;
        payload.institutionCode = institutionCode;
        delete payload.institution;
      }
      if (editor.id) {
        payload.id = editor.id;
        yield call(update, payload);
      } else {
        payload.status = 1;
        yield call(create, payload);
      }
      const { pagination } = yield select(({ grade }) => grade);
      yield put({
        type: 'fetch',
        payload: pagination,
      });
      yield put({
        type: 'closeModal',
      });
    },
    *remove({ id }, { call, put, select }) {
      const { data } = yield call(remove, id);
      if (data) {
        const list = yield select(({ grade }) => grade.data);
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
      const { data } = yield call(findInst, { ...payload, level: 0 });
      yield put({
        type: 'upState',
        payload: {
          inst: data,
        },
      });
    },
    *changeStatus({ payload }, { call, put, select }) {
      const { data } = yield call(update, payload);
      if (data) {
        message.success('状态更新成功');
        const list = yield select(({ grade }) => grade.data);
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
    // upEditors(state, { payload }) {
    //   const error = { ...state.error };
    //   _.each(payload, (v, k) => {
    //     const { value, errors } = v;
    //     _.set(state, `editor.${k}`, value);
    //     error[k] = errors;
    //   });
    //   return { ...state, error };
    // },
    fieldsChange,
  },
};
