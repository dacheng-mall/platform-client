import { getCmsElements } from '../services';
import { dictGetElementsTypes } from '../../../services/dict';

export default {
  namespace: 'elements',
  state: {
    list: [],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/cms/elements') {
          dispatch({
            type: 'init',
          });
        }
      });
    },
  },
  effects: {
    *init(p, { put, call }) {
      const { data } = yield call(getCmsElements);
      yield put({
        type: 'getTypes',
      });
      yield put({
        type: 'upState',
        payload: data,
      });
    },
    *getTypes(p, { put, call, select }) {
      const dict = yield select(({ app }) => app.dict);
      if (!dict.elementTypes) {
        const { data } = yield call(dictGetElementsTypes);
        yield put({
          type: 'app/upState',
          payload: { dict: { ...dict, ...data } },
        });
      }
    },
  },
  reducers: {
    upState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
