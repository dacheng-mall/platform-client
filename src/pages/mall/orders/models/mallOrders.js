import _ from 'lodash';
import { message } from 'antd';
import {
  fetch,
  update,
  send,
  remove,
  refunded,
  getCompanies,
  delivery,
  stockUp,
  stockUpCancel,
} from '../services';
import { sleep } from '../../../../utils';

const PAGE_DEF = { page: 1, pageSize: 10 };

export default {
  namespace: 'mallOrders',
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/mall/orders') {
          dispatch({ type: 'init' });
        }
      });
    },
  },
  state: {
    pagination: { ...PAGE_DEF },
    data: [],
    options: [],
    query: {},
    delivery: null,
    sending: null,
  },
  effects: {
    *init(p, { put }) {
      yield put({
        type: 'fetch',
        payload: PAGE_DEF,
      });
    },
    *searchCompanies({ keyword }, { put, call }) {
      const { data } = yield call(getCompanies, { keyword });
      yield put({
        type: 'upState',
        payload: {
          options: data,
        },
      });
    },
    *fetch({ payload = {} }, { call, put, select }) {
      const { query, pagination } = yield select(({ mallOrders }) => mallOrders);
      const { page, pageSize } = pagination;
      const _query = _.cloneDeep(query);
      console.log('_query', _query);
      console.log;
      if (_query.status && _query.status.length > 0) {
        _query.status = _query.status.join(',');
      }
      if (_query.range && _query.range.length > 0) {
        const [from, to] = _query.range;
        _query.from = from.format('YYYY-MM-DDTHH:mm:ss');
        _query.to = to.format('YYYY-MM-DDTHH:mm:ss');
        delete _query.range;
      }
      const { data } = yield call(fetch, { page, pageSize, ...payload, ..._query });
      yield put({
        type: 'upState',
        payload: { ...data },
      });
    },
    *refund({ id }, { call, put }) {
      const { data } = yield call(refunded, id);
      if (data.result === 'updated') {
        yield put({
          type: 'fetch',
        });
      }
    },
    *stockUp({ id }, { call, put }) {
      const { data } = yield call(stockUp, id);
      if (data.result === 'updated') {
        yield sleep(1000);
        yield put({
          type: 'fetch',
        });
      }
    },
    *stockUpCancel({ id }, { call, put }) {
      const { data } = yield call(stockUpCancel, id);
      if (data.result === 'updated') {
        yield sleep(1000);
        yield put({
          type: 'fetch',
        });
      }
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
    *updateDelivery({ values }, { call, put, select }) {
      const { delivery: _delivery } = yield select(({ mallOrders }) => mallOrders);
      if (!_delivery || !_delivery.id) {
        return;
      }
      const id = _delivery.id;
      const { data } = yield call(delivery, { ...values, id });
      if (data.result === 'updated') {
        message.success('更新成功');
        yield put({
          type: 'upState',
          payload: { delivery: null },
        });
        yield sleep(500);
        yield put({
          type: 'fetch',
        });
      }
    },
    *send({ values }, { call, put }) {
      const {
        logistics: { key, label },
        sn,
        id,
      } = values;
      const body = { id, logistics: { sn, code: key, name: label } };
      const { data } = yield call(send, body);
      if (data.result === 'updated') {
        message.success('发货成功');
        yield put({
          type: 'upState',
          payload: { sending: null },
        });
        yield sleep(500);
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
    // *syncStore({ id }, { put, call }) {
    //   const data = yield call(syncStore, id);
    // },
  },
  reducers: {
    upState: (state, { payload }) => {
      return { ...state, ...payload };
    },
  },
};
