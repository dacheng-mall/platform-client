import { getAdmins } from '../services';
export default {
  namespace: 'admin',
  state: {
    list: [],
    pagination: {},
    editor: null,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/users/admin') {
          dispatch({ type: 'init' });
        }
      });
    },
  },

  effects: {
    *init({ paylaod }, { put, call, select }) {
      const { data } = yield call(getAdmins);
      yield console.log('init', data.data);
      yield put({
        type: 'upState',
        payload: data,
      });
    },
  },
  reducers: {
    upState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
