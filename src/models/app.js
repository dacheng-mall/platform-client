import _ from 'lodash';
import { login } from '../services/app';
import { jump } from '../utils';
import { setAuthority } from '../utils/authority';
import { menu } from '../pages/_layouts/menuData';

export default {
  namespace: 'app',

  state: {
    institutionLogo: null,
    user: {},
    roles: [],
    dict: {}
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname !== '/') {
          dispatch({ type: 'reSetUserInfo' });
        }
      });
    },
  },

  effects: {
    *reSetUserInfo(p, { call, put, select }) {
      const { user } = yield select(({ app }) => app);
      if (_.isEmpty(user)) {
        // 用户在非根路径的页面刷新了, 如果sessionStorage有user的值就重置state里的user的值
        // 否则跳转登录界面
        const user = sessionStorage.getItem('user');
        if (user) {
          yield put({
            type: 'upState',
            payload: {
              user: JSON.parse(user),
              menu: menu()
            },
          });
        } else {
          jump('/');
        }
      }
    },
    *login({ payload }, { call, put, all }) {
      const { data } = yield call(login);
      const redirect = menu => {
        const allow = _.find(menu, ({ authority }) => authority);
        const makePath = (item, prefix = '/') => {
          if(item.children && item.children.length > 0) {
            return makePath(item.children[0], `/${item.path}`);
          }
          return `${prefix}${item.path}`
        }
        if (allow) {
          return makePath(allow)
        }
        return '/';
      };
      if (data) {
        const _menu = menu();
        yield all([
          put({
            type: 'upState',
            payload: { user: data, menu: _menu },
          }),
          jump(redirect(_menu)),
        ]);
      }
      sessionStorage.setItem('user', JSON.stringify(data));
      setAuthority(data.roles)
    },
    // *logout(p, { put, call }) {
    //   const { error } = yield call(logout);
    //   if (!error) {
    //     sessionStorage.clear();
    //     jump('/');
    //     yield put({
    //       type: 'upState',
    //       payload: { user: {} },
    //     });
    //   }
    // },
  },

  reducers: {
    upState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
