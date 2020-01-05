import _ from 'lodash';
import ptrx from 'path-to-regexp';
import { message } from 'antd';
import { match, fetch, find, add, update, remove } from '../services';
import { fieldsChange } from '../../../../utils/ui';

const PAGE_DEF = { page: 1, pageSize: 8 };
const INIT_EDITOR = {
  editor: null,
  errors: {},
};
export default {
  namespace: 'dict',
  state: {
    data: [],
    initOptions: [],
    options: [],
    _options: null,
    parents: [],
    sys: [],
    pagination: { ...PAGE_DEF },
    ...INIT_EDITOR,
    query: {},
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const pn = ptrx('/dict/:type').exec(pathname);
        if (pn) {
          const type = pn[1];
          dispatch({
            type: 'init',
            payload: {
              type,
            },
          });
        }
      });
    },
  },

  effects: {
    *init({ payload: { type } }, { select, put, call }) {
      const { type: oldType } = yield select(({ dict }) => dict);
      if (oldType !== type) {
        yield put({
          type: 'upState',
          payload: {
            type,
            query: {}
          },
        });
        yield put({
          type: 'sys',
        });
        yield put({
          type: 'fetch',
          payload: {
            ...PAGE_DEF,
          },
        });
      }
    },
    *changeQuery({ payload }, { put, select }) {
      const { query } = yield select(({ dict }) => dict);
      yield put({
        type: 'upState',
        payload: {
          query: {
            ...query,
            ...payload,
          },
        },
      });
    },
    *editor({ payload }, { put, call, select }) {
      const { type } = yield select(({ dict }) => dict);
      const { data } = yield call(match, { type, id: payload.editor.pid });
      yield put({
        type: 'upState',
        payload: {
          initOptions: data ? [data] : [],
          visible: true,
          editor: payload.editor,
        },
      });
    },
    *sys(p, { put, call, select }) {
      const { sys } = yield select(({ dict }) => dict);
      if (!sys || sys.length < 1) {
        const { data } = yield call(find, { type: 'sys', query: { status: '1' } });
        yield put({
          type: 'upState',
          payload: {
            sys: data,
          },
        });
      }
    },
    *cancel(p, { put }) {
      yield put({
        type: 'upState',
        payload: {
          visible: false,
          initOptions: [],
        },
      });
      setTimeout(() => {
        put({
          type: 'upState',
          payload: {
            editor: null,
          },
        });
      }, 1000);
    },
    *search({ payload: { keyword } }, { call, put, select }) {
      const { type, editor } = yield select(({ dict }) => dict);
      const { data } = yield call(find, { type, query: { name: keyword } });
      _.remove(data, ['id', editor.id]);
      yield put({
        type: 'upState',
        payload: {
          options: data,
        },
      });
    },
    *searchParents({ payload: { keyword } }, { call, put, select }) {
      console.log('searchParents', keyword);
      const { type } = yield select(({ dict }) => dict);
      const { data } = yield call(find, { type, query: { name: keyword } });
      yield put({
        type: 'upState',
        payload: {
          parents: [...data],
        },
      });
    },
    *fetch({ payload }, { call, select, put }) {
      const { query, pagination, type } = yield select(({ dict }) => dict);
      const { page, pageSize } = pagination;
      _.forEach(query, (val, key) => {
        if (!val) {
          delete query[key];
        }
      });
      const { data } = yield call(fetch, { type, page, pageSize, ...payload, query });
      yield put({
        type: 'upState',
        payload: {
          ...data,
          query,
        },
      });
    },
    *submit({ payload, resetFields }, { call, put, select }) {
      const { editor } = yield select(({ dict }) => dict);
      if (editor.id) {
        console.log('payload', payload);
        const { data } = yield call(update, {
          id: editor.id,
          ...payload,
          pid: payload.pid || null,
        });
        if (data) {
          message.success('更新成功');
          resetFields();
          yield put({
            type: 'fetch',
          });
          yield put({
            type: 'cancel',
          });
        }
      } else {
        const { data } = yield call(add, { ...payload });
        if (data) {
          message.success('添加成功');
          resetFields();
          yield put({
            type: 'fetch',
          });
          yield put({
            type: 'cancel',
          });
        }
      }
    },
    *changeStatus({ payload }, { call, put }) {
      try {
        const { data } = yield call(update, payload);
        if (data) {
          message.success('更新成功');
          yield put({
            type: 'fetch',
          });
        }
      } catch (error) {
        message.warning(JSON.parse(error).message);
      }
    },
    *remove({ id }, { call, put }) {
      try {
        const { data } = yield call(remove, id);
        if (data) {
          message.success('删除成功');
          yield put({
            type: 'fetch',
          });
        }
      } catch (error) {
        message.warning(JSON.parse(error).message);
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
