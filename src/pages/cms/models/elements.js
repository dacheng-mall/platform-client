import _ from 'lodash';
import { getCmsElements, updateCmsElement, removeCmsElement } from '../services';

const DEFAULT_PAGE = {
  page: 1,
  pageSize: 10
}
export default {
  namespace: 'elements',
  state: {
    data: [],
    pagination: DEFAULT_PAGE
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
    *init(p, { put }) {
      yield put({
        type: 'fetch',
      });
    },
    *fetch({ payload = DEFAULT_PAGE }, { put, call }) {
      const { data } = yield call(getCmsElements, payload);
      yield put({
        type: 'upState',
        payload: data,
      });
    },
    *remove({ id }, { call, select, put }) {
      const { data } = yield select(({ elements }) => elements);
      yield call(removeCmsElement, id);
      _.remove(data, (d) => d.id === id);
      yield put({
        type: 'upState',
        payload: {
          data: [...data],
        },
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
