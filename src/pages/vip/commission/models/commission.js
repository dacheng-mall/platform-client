import _ from 'lodash';
import moment from 'moment';
import { message } from 'antd';
import { fetch, update, clone, remove } from '../services';
import { sleep } from '../../../../utils';

const PAGE_DEF = { page: 1, pageSize: 10 };

export default {
  namespace: 'commission',
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/vip/commission') {
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
      const { query, pagination } = yield select(({ commission }) => commission);
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
      if (_query.range && _query.range.length > 0) {
        _query.from = moment(_query.range[0]).format('YYYY-MM-DDT00:00:00');
        _query.to = moment(_query.range[1]).format('YYYY-MM-DDT23:59:59');
      }
      delete _query.range;
      const { data } = yield call(fetch, { page, pageSize, ...payload, ..._query });
      console.log('data', data);
      yield put({
        type: 'upState',
        payload: { ...data },
      });
    },
    *operate({ payload }, { call, put }) {
      const { data: _data } = yield call(update, payload);
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
  },
  reducers: {
    upState: (state, { payload }) => {
      return { ...state, ...payload };
    },
  },
};
