import _ from 'lodash';
import { message } from 'antd';
import { fetch, update, visitedCSV, translate, remove } from '../services';

const PAGE_DEF = { page: 1, pageSize: 6 };

export default {
  namespace: 'task',
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/mission/task') {
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
    *init(p, { put, select }) {
      const { pagination, data } = yield select(({ task }) => task);
      if (data.length < 1) {
        yield put({
          type: 'fetch',
          payload: { ...pagination },
        });
      }
    },
    *fetch({ payload = {} }, { put, call, select }) {
      try {
        const { query } = yield select(({ task }) => task);
        const { data } = yield call(fetch, { ...PAGE_DEF, ...payload, query });
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
    *changeEnable({ id, body }, { call, put, select }) {
      const { data: _data } = yield call(update, { id, ...body });
      if (_data.result === 'updated') {
        message.success(`更新成功`);
        const { data } = yield select(({ task }) => task);
        const target = _.find(data, ['id', id]);
        target.enable = body.enable;
        yield put({
          type: 'upState',
          payload: { data: [...data] },
        });
      }
    },
    *visitedCSV({ payload }, { call }) {
      console.log('payload', payload);
      const { data } = yield call(visitedCSV, payload);

      if (data && data.url) {
        message.success('导出成功');
        window.location.href = `${window.config.api_prod}${data.url}`;
      } else {
        message.warning(`导出失败-${data}`);
      }
      console.log(data);
    },
    *translate({ payload }, { call }) {
      console.log('payload', payload);
      const { data } = yield call(translate, payload);

      // if (data && data.url) {
      //   message.success('导出成功');
      //   window.location.href = `${window.config.api_prod}${data.url}`;
      // } else {
      //   message.warning(`导出失败-${data}`);
      // }
      console.log(data);
    },
    *remove({ id }, { call, put }) {
      try {
        const res = yield call(remove, id);
        yield put({
          type: 'fetch',
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
