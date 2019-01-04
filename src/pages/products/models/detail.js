import ptrx from 'path-to-regexp';
import { getProduct } from '../services';
import { fieldsChange } from '../../../utils/ui';
import { upload } from '../../../utils';

export default {
  namespace: 'detail',
  state: {
    editor: {},
    errors: {},
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const pn = ptrx('/products/detail/:id').exec(pathname);
        let id;
        if (pn) {
          id = pn[1];
        }
        dispatch({
          type: 'init',
          id,
        });
      });
    },
  },
  effects: {
    *init({ id }, { call, put }) {
      if (id) {
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
      } else {
        yield put({
          type: 'upState',
          payload: { editor: {} },
        });
      }
    },
    *submit(p, { call, put, select, all }) {
      const { editor, errors } = yield select(({ detail }) => detail);
      const errorKeys = Object.keys(errors);
      if (errorKeys.length > 0) {
        return;
      }
      
      // const res3 = yield all([
      //   upload(null, 3000, 3000),
      //   upload(null, 1000, 1000),
      //   upload(null, 2000, 2000),
      // ])
      // todo 上传图片和序列化商品数据在这里进行
      // console.log('需要提交的数据', res3);
    },
  },
  reducers: {
    upState(state, { payload }) {
      return { ...state, ...payload };
    },
    fieldsChange,
  },
};
