
export default {
  namespace: 'qrCreate',
  state: {
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/qr/create') {
          dispatch({ type: 'init' });
        }
      });
    },
  },

  effects: {}
}