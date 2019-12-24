import _ from 'lodash';
import { message } from 'antd';
import { generateTickets, getTickets, exportCSV, batch, remove, update } from '../service';

const PAGE_DEF = { page: 1, pageSize: 8 };
const QUERY_DEF = {
  code: '',
  gte: null,
  lte: null,
};
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
    query: { ...QUERY_DEF },
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
    *remove({ id }, { call, put }) {
      const { data } = yield call(remove, id);
      if (data.result === 'updated') {
        message.success(`删除成功`);
        yield daley(500);
        yield put({
          type: 'fetch',
          payload: {
            ...PAGE_DEF,
          },
        });
      }
    },
    *edit({ payload = {}, form }, { call, put, select }) {
      try {
        const { id } = yield select(({ tickets }) => tickets);
        const body = { ...payload };
        _.forEach(payload, (val, key) => {
          if (val === undefined || val === null || val === '') {
            delete payload[key];
          }
        });
        if (!_.isEmpty(body)) {
          const { data } = yield call(update, { id, ...body });
          if (data.result === 'updated') {
            message.success(`更新成功`);
            yield put({
              type: 'upState',
              payload: {
                visible: false,
                loading: false,
                query: { ...QUERY_DEF },
              },
            });
            form.resetFields();
            yield daley(500);
            yield put({
              type: 'fetch',
              payload: {
                ...PAGE_DEF,
              },
            });
          }
        } else {
          message.warning('没有需要修改的内容');
        }
      } catch (error) {
        console.log(error);
      }
    },
    *changeEnable({ id, body }, { call, put, select }) {
      const { data: _data } = yield call(update, { id, ...body });
      if (_data.result === 'updated') {
        message.success(`更新成功`);
        const { data } = yield select(({ tickets }) => tickets);
        const target = _.find(data, ['id', id]);
        target.enable = body.enable;
        // yield daley(1000);
        yield put({
          type: 'upState',
          payload: { data: [...data] },
        });
      }
    },
    *exportCSV({ prefix }, { call, select }) {
      try {
        const { query } = yield select(({ tickets }) => tickets);
        const { data } = yield call(exportCSV, { query, prefix });

        if (data && data.url) {
          message.success('导出成功');
          window.location.href = `${window.config.api_prod}${data.url}`;
        } else {
          message.warning(`导出失败-${data}`);
        }
      } catch (error) {}
    },
    *batch({ payload, form }, { call, put, select }) {
      try {
        const { query } = yield select(({ tickets }) => tickets);
        const { prize, expiredTime, code, enable } = payload;
        const { id, name, value } = prize || {};
        const body = {};
        if (id) {
          body.prize = { id, name, value };
        }
        if (expiredTime) {
          body.expiredTime = expiredTime;
        }
        if (code) {
          body.code = code;
        }
        if (enable !== undefined) {
          body.enable = enable;
        }
        if (_.isEmpty(body)) {
          message.warning(`没有任何更新项`);
          return;
        }
        const { data } = yield call(batch, { query, body });
        if (data) {
          message.success(`成功更新${data.total}个兑换券`);
          yield put({
            type: 'upState',
            payload: {
              visible: false,
              loading: false,
              query: { ...QUERY_DEF },
            },
          });
          form.resetFields();
          yield daley(2000);
          yield put({
            type: 'fetch',
            payload: {
              ...PAGE_DEF,
            },
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    *generateTickets({ payload, form }, { put, call }) {
      try {
        yield put({
          type: 'upState',
          payload: {
            loading: true,
          },
        });
        const { prize, ...values } = payload;
        const body = { ...values };
        if (prize) {
          const { id, name, value } = prize;
          body.prize = { id, name, value };
        }
        const { data } = yield call(generateTickets, body);
        if (!data.errors) {
          message.success(`成功生成${payload.count}个兑换券`);
        }
        yield put({
          type: 'upState',
          payload: {
            visible: false,
            loading: false,
            query: { ...QUERY_DEF },
          },
        });
        form.resetFields();
        yield daley(2000);
        yield put({
          type: 'fetch',
          payload: {
            ...PAGE_DEF,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
  reducers: {
    upState: (state, { payload }) => {
      return { ...state, ...payload };
    },
  },
};
