import ptrx from 'path-to-regexp';
import { getCmsList, getCmsSwiper } from '../services';

export default {
  namespace: 'elementEditor',
  state: {},
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const pn = ptrx('/cms/element/:type/:id').exec(pathname);
        if (pn) {
          const typeCode = pn[1];
          const id = pn[2];
          dispatch({
            type: 'init',
            id,
            typeCode,
          });
        }
      });
    },
  },
  effects: {
    *init({ id, typeCode }, { put, call }) {
      let _data;
      if (typeCode === 'list') {
        const { data } = yield call(getCmsList);
        _data = data;
      } else {
        const { data } = yield call(getCmsSwiper);
        _data = data;
      }
      yield put({
        type: 'upState',
        payload: {
          ..._data,
          type: typeCode,
        },
      });
    },
    *getTypes(p, { put, call, select }) {
    },
  },
  reducers: {
    upState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
