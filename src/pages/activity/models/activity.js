export default {
  namespace: 'activity',
  state: {},
  subscription: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === 'activity') {
        }
      });
    },
  },
  effects: {},
  reducers: {
    upState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
