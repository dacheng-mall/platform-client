import ptrx from 'path-to-regexp';
import { getProduct } from '../services';
import { fieldsChange } from '../../../utils/ui';

export default {
  namespace: 'detail',
  state: {
    editor: null,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const pn = ptrx('/products/detail/:id').exec(pathname);
        if (pn) {
          const id = pn[1];
          dispatch({
            type: 'init',
            id,
          });
        }
      });
    },
  },
  effects: {
    *init({ id }, { call, put }) {
      const { data } = yield call(getProduct, id);
      yield new Promise(function(res) {
        setTimeout(() => {
          res();
        }, 1000);
      });
      yield put({
        type: 'upState',
        payload: { editor: data },
      });
    },
  },
  reducers: {
    upState(state, { payload }) {
      return { ...state, ...payload };
    },
    fieldsChange,
  },
};
