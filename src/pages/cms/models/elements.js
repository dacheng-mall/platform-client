import _ from 'lodash';
import { getCmsElements, updateCmsElement } from '../services';

export default {
  namespace: 'elements',
  state: {
    data: [],
    pagination: {
      page: 1,
      pageSize: 10,
    },
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
    *init(p, { put, call, select }) {
      const { pagination } = yield select(({ elements }) => elements);
      const { data } = yield call(getCmsElements, pagination);
      yield put({
        type: 'upState',
        payload: { ...data },
      });
    },
    *setStatus({ id, status }, { call, put, select }) {
      const { data: res } = yield call(updateCmsElement, { id, status: status ? 1 : 0 });
      if (res) {
        const { data } = yield select(({ elements }) => elements);
        _.find(data, ['id', res.id]).status = res.status;
        yield put({
          type: 'upState',
          payload: { data: [...data] },
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
