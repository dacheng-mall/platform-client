import _ from 'lodash';
import { message } from 'antd';
import { getOrders, getCompanies, send, addCardSN } from '../service';

const PAGE_DEF = { page: 1, pageSize: 8 };

export default {
  namespace: 'orders',
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        switch (pathname) {
          case '/trade/orders': {
            dispatch({ type: 'init', payload: {} });
            break;
          }
          case '/trade/sending': {
            dispatch({ type: 'init', payload: { status: 'sending' }, orderType: 'sending' });
            break;
          }
          default: {
            break;
          }
        }
      });
    },
  },
  state: {
    data: [],
    options: [],
    pagination: {
      ...PAGE_DEF,
    },
  },
  effects: {
    *init({ payload, orderType }, { select, put }) {
      const { pagination } = yield select(({ orders }) => orders);
      yield put({
        type: 'fetch',
        payload: { ...pagination, query: payload },
      });
      if (orderType) {
        yield put({
          type: 'upState',
          payload: {
            type: orderType,
          },
        });
      }
    },
    *fetch({ payload }, { put, call, select }) {
      try {
        const { query } = yield select(({ orders }) => orders);
        const { data } = yield call(getOrders, {
          ...payload,
          query: { ...query, ...payload.query },
        });
        yield put({
          type: 'upState',
          payload: {
            ...data,
          },
        });
      } catch (error) {
        console.log(error);
      }
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
    *send({ values }, { select, call, put }) {
      try {
        const logistics = {
          code: values.logistics.key,
          name: values.logistics.label,
          sn: values.sn,
        };
        delete values.sn;
        const { sending, data } = yield select(({ orders }) => orders);
        values.logistics = logistics;
        values.id = sending.id;
        const { data: _data } = yield call(send, values);
        if (_data.id) {
          const index = _.findIndex(data, ['id', _data.id]);
          data[index] = { ...data[index], ..._data };
          yield put({
            type: 'upState',
            payload: {
              sending: null,
              visible: false,
              data: [...data],
            },
          });
          message.success('发货成功');
        }
      } catch (error) {}
    },
    *addCardSN(p, { call }) {
      console.log('------')
      try {
        const data = yield call(addCardSN);
        console.log(data);
      } catch (error) {}
    },
  },
  reducers: {
    upState: (state, { payload }) => {
      return { ...state, ...payload };
    },
  },
};
