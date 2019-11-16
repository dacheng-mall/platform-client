import _ from 'lodash';
import { message } from 'antd';
import { generateTickets, getTickets } from '../service';

const PAGE_DEF = { page: 1, pageSize: 8 };

export default {
  namespace: 'tickets',
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/convert/tickets') {
          dispatch({ type: 'init' });
        }
      });
    },
  },
  state: {
    pagination: { ...PAGE_DEF },
    data: [],},

  effects: {
    *init(p, { select, put }) {
      const { pagination, data } = yield select(({ prizes }) => prizes);
      if (data.length < 1) {
        yield put({
          type: 'fetch',
          payload: { ...pagination },
        });
      }
    },
    *fetch({ payload }, { put, call }) {
      try {
        const from = (payload.page - 1) * payload.pageSize;
        const { data } = yield call(getTickets, { from, size: payload.pageSize });
        const {
          hits,
          total: { value: total },
        } = data.hits;
        const _list = _.map(hits, (item) => ({ ...item._source, id: item._id }));
        const _pagination = {
          total,
          pageCount: Math.ceil(total / payload.pageSize),
          page: payload.page,
          pageSize: payload.pageSize,
        };
        yield put({
          type: 'upState',
          payload: {
            data: _list,
            pagination: _pagination,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
    *generateTickets({ payload }, { put, call }) {
      try {
        const { data } = yield call(generateTickets, payload);
        if (!data.errors) {
          message.success(`成功生成${payload.count}个兑换券`);
          yield put({
            type: 'upState',
            payload: {
              visible: false,
            },
          });
        }
      } catch (error) {}
    },
  },
  reducers: {
    upState: (state, { payload }) => {
      return { ...state, ...payload };
    },
  },
};
