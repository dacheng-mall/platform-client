import _ from 'lodash';
import { message } from 'antd';
import { fetch, update, exportOrderCSV, clone, remove, getStore, setStore } from '../services';
import { sleep } from '../../../../utils';
import { get } from '../../../../utils/request';

const PAGE_DEF = { page: 1, pageSize: 6 };

export default {
  namespace: 'gathering',
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/gathering/active') {
          dispatch({ type: 'init' });
        }
      });
    },
  },
  state: {
    pagination: { ...PAGE_DEF },
    data: [],
    query: {},
    editingStore: null,
  },
  effects: {
    *init(p, { put, select }) {
      const { pagination, data } = yield select(({ gathering }) => gathering);
      if (data.length < 1) {
        yield put({
          type: 'fetch',
          payload: { ...pagination },
        });
      }
    },
    *fetch({ payload }, { put, call, select }) {
      try {
        const { query } = yield select(({ gathering }) => gathering);
        const { data } = yield call(fetch, { ...payload, query });
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
    *clone({ payload }, { call, put, select }) {
      try {
        yield call(clone, payload.id);
        const { pagination } = yield select(({ gathering }) => gathering);

        yield sleep();
        yield put({
          type: 'fetch',
          payload: { ...pagination },
        });
        message.success('克隆成功');
      } catch (error) {
        message.error(error);
      }
    },
    *store({ id }, { call, put }) {
      try {
        // 先获取, 再设置
        const { data } = yield call(getStore, id);
        yield put({
          type: 'upState',
          payload: {
            editingStore: {
              ...data,
              value: data.current,
            },
          },
        });
      } catch (error) {}
    },
    *changeStore({ value }, { call, put, select }) {
      const { editingStore } = yield select(({ gathering }) => gathering);
      yield put({
        type: 'upState',
        payload: {
          editingStore: {
            ...editingStore,
            value,
          },
        },
      });
    },
    *setStore(p, { call, put, select }) {
      try {
        // 先获取, 再设置
        const { editingStore } = yield select(({ gathering }) => gathering);
        if (!editingStore) {
          message.error('无有效数据可编辑');
          return;
        }
        const { value, id } = editingStore;
        // body.current = value;
        const { data } = yield call(setStore, { current: value, id });
        if (data === 'OK') {
          yield put({
            type: 'upState',
            payload: {
              editingStore: null,
            },
          });
        }
      } catch (error) {}
    },
    *delete({ id }, { call, put, select }) {
      yield call(remove, id);
      const { pagination } = yield select(({ gathering }) => gathering);

      yield sleep();
      yield put({
        type: 'fetch',
        payload: { ...pagination },
      });
      message.success('删除成功');
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
    *exportCSV({ payload }, { call }) {
      switch (payload.type) {
        case 'order': {
          const { data } = yield call(exportOrderCSV, payload);
          if (data && data.url) {
            message.success('导出成功');
            window.location.href = `${window.config.api_prod}${data.url}`;
          } else {
            message.warning(`导出失败-${data}`);
          }
          break;
        }
        case 'tickets': {
          break;
        }
      }
    },
  },
  reducers: {
    upState: (state, { payload }) => {
      return { ...state, ...payload };
    },
  },
};
