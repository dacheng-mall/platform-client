import _ from 'lodash';
import { message } from 'antd';
import { fetch, update, clone, remove, syncStore } from '../../services';
import { sleep } from '../../../../utils';

const PAGE_DEF = { page: 1, pageSize: 10 };

export default {
  namespace: 'mallProducts',
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/mall/products') {
          dispatch({ type: 'init' });
        }
      });
    },
  },
  state: {
    pagination: { ...PAGE_DEF },
    data: [],
    query: {},
  },
  effects: {
    *init(p, { put }) {
      yield put({
        type: 'fetch',
        payload: PAGE_DEF,
      });
    },
    *fetch({ payload = {} }, { call, put, select }) {
      const { query, pagination } = yield select(({ mallProducts }) => mallProducts);
      const { page, pageSize } = pagination;
      const _query = _.clone(query);
      if (_query.status) {
        switch (_query.status) {
          case 'all': {
            delete _query.status;
            break;
          }
        }
      }
      const { data } = yield call(fetch, { page, pageSize, ...payload, ..._query });
      yield put({
        type: 'upState',
        payload: { ...data },
      });
    },
    *changeEnable({ id, body }, { call, put }) {
      const { data: _data } = yield call(update, { id, ...body });
      if (_data.result === 'updated') {
        message.success('更新成功');
        yield sleep(1000);
        yield put({
          type: 'fetch',
        });
      }
    },
    *clone({ id }, { call, put }) {
      const { data: _data } = yield call(clone, id);
      if (_data.id) {
        message.success('克隆成功');
        yield sleep(1000);
        yield put({
          type: 'fetch',
        });
      }
    },
    *remove({ id }, { call, put }) {
      const { data: _data } = yield call(remove, id);
      if (_data.result === 'deleted') {
        message.success('删除成功');
        yield sleep(1000);
        yield put({
          type: 'fetch',
        });
      }
    },
    *search(p, { put }) {
      yield put({
        type: 'fetch',
        payload: PAGE_DEF,
      });
    },
    *syncStore({ id }, { put, call }) {
      const data = yield call(syncStore, id);
    },
  },
  reducers: {
    upState: (state, { payload }) => {
      return { ...state, ...payload };
    },
  },
};
