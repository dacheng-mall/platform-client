import _ from 'lodash';
import { getCate, addCate, updateCate } from '../services';
import { message } from 'antd';

const getChildren = (id, list) => {
  let children = _.filter(list, ({ pid }) => id === pid);
  const childrenKey = [];
  while (children.length > 0) {
    const keys = _.map(children, ({ id }) => id);
    childrenKey.push(...keys);
    children = _.filter(list, ({ pid }) => _.includes(keys, pid));
  }
  return childrenKey;
};

export default {
  namespace: 'categories',
  state: {
    data: [],
    editor: null,
    parentCategories: [],
    needUpdate: true,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/products/categories') {
          dispatch({ type: 'init' });
        }
      });
    },
  },

  effects: {
    *init(p, { put, select }) {
      const { data } = yield select(({ categories }) => categories);
      if (data.length < 1) {
        yield put({
          type: 'fetch',
        });
      }
    },
    *fetch(p, { call, put }) {
      const { data } = yield call(getCate);
      if (data.length > 0) {
        yield put({
          type: 'upState',
          payload: {
            data,
          },
        });
      }
    },
    *edit({ payload }, { put }) {
      payload.pid = payload.pid || undefined;
      if (payload.pid) {
        yield put({
          type: 'fetchCate',
          payload: { id: payload.pid },
        });
      }
      yield put({
        type: 'upState',
        payload: {
          editor: payload,
        },
      });
    },
    *fetchCate({ payload }, { call, put }) {
      const { data } = yield call(getCate, payload);
      if (data.length > 0) {
        yield put({
          type: 'upState',
          payload: {
            parentCategories: data,
          },
        });
      }
    },
    *submit({ value }, { call, select, put }) {
      const { data: list, parentCategories } = yield select(({ categories }) => categories);
      value.pid = value.pid || '';
      const childrenKyes = yield getChildren(value.id, list);
      if (_.includes(childrenKyes, value.pid)) {
        message.error('不能将子集类型设置为父类型')
        return;
      }
      value.status = value.status ? 1 : 0;
      delete value.createTime;
      delete value.children;
      if (value.pid) {
        const parent = _.find(parentCategories, ['id', value.pid]);
        if (parent) {
          value.pname = parent.name;
        }
      }
      if (value.id) {
        // 编辑
        const { data } = yield call(updateCate, value);
        const index = _.findIndex(list, ['id', data.id]);
        if (data && index !== -1) {
          list[index] = data;
        }
      } else {
        // 新建
        const { data } = yield call(addCate, value);
        if (data) {
          list.unshift(data);
        }
      }
      yield put({
        type: 'upState',
        payload: {
          data: [...list],
          needUpdate: true,
          editor: null,
        },
      });
    },
  },
  reducers: {
    upState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
