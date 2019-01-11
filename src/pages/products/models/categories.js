import { getCate, addCate, updateCate } from '../services';
import { fieldsChange } from '../../../utils/ui';

const DEFAULT_PAGE = {
  page: 1,
  pageSize: 10,
};

export default {
  namespace: 'categories',
  state: {
    data: [],
    editor: null,
    errors: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        switch (pathname) {
          case '/products/categories': {
            dispatch({ type: 'init', paylaod: 'categories' });
            break;
          }
          default: {
            break;
          }
        }
      });
    },
  },

  effects: {
    *init({ paylaod = DEFAULT_PAGE }, { put, call, select }) {
      const { data } = yield call(getCate);
      yield put({
        type: 'upState',
        payload: data,
      });
    },
    *fetchWithName({ payload }, { call, put }) {
      console.log(payload);
      const { data } = yield call(getCate, { name: payload });
      console.log(data)
    },
    *submit({ payload }, { call }) {
      const { id, editor } = payload;
      if (id) {
        // 编辑
        const { data } = yield call(updateCate, { id, editor });
      } else {
        // 新建
        const { data } = yield call(addCate, { editor });
      }
    },
  },
  reducers: {
    upState(state, { payload }) {
      return { ...state, ...payload };
    },
    fieldsChange,
  },
};
