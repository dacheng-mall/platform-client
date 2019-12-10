import _ from 'lodash';
import { message } from 'antd';
import { generateTickets, getTickets, exportCSV } from '../service';

const PAGE_DEF = { page: 1, pageSize: 8 };

function parseQuery(_q) {
  let query;
  if (_q.code || _q.range) {
    query = {};
    if (_q.code) {
      query.term = {
        code: {
          value: _q.code,
        },
      };
    }
    if (_q.range) {
      query.range = {
        sn: _q.range,
      };
    }
  }
  return query;
}
function daley(time = 500) {
  return new Promise((res) => {
    setTimeout(() => {
      res();
    }, time);
  });
}
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
    data: [],
    query: {
      code: '',
      gte: null,
      lte: null,
    },
  },
  effects: {
    *init(p, { select, put }) {
      const { pagination, data } = yield select(({ tickets }) => tickets);
      if (data.length < 1) {
        yield put({
          type: 'fetch',
          payload: { ...pagination },
        });
      }
    },
    *fetch({ payload }, { put, call, select }) {
      try {
        const { query } = yield select(({ tickets }) => tickets);
        const { data } = yield call(getTickets, { ...payload, query });
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
    *exportCSV(p, { call, put, select }) {
      try {
        const { query } = yield select(({ tickets }) => tickets);
        // const query = parseQuery(_q);
        const { data } = yield call(exportCSV, query);

        if (data && data.url) {
          message.success('导出成功');
          window.location.href = `${window.config.api_prod}${data.url}`;
        } else {
          message.warning(`导出失败-${data}`);
        }
      } catch (error) {}
    },
    *generateTickets({ payload }, { put, call }) {
      try {
        const {
          prize: { id, name, value },
          ...values
        } = payload;
        const { data } = yield call(generateTickets, { prize: { id, name, value }, ...values });
        if (!data.errors) {
          message.success(`成功生成${payload.count}个兑换券`);
          yield put({
            type: 'upState',
            payload: {
              visible: false,
            },
          });
        }
        yield daley(2000);
        console.log('yanchile');
        yield put({
          type: 'fetch',
          payload: {
            ...PAGE_DEF,
          },
        });
      } catch (error) {}
    },
  },
  reducers: {
    upState: (state, { payload }) => {
      return { ...state, ...payload };
    },
  },
};
