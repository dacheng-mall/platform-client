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
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        // if (pathname === '/') {
        //   dispatch({
        //     type: 'init',
        //   });
        // } else {
        //   dispatch({ type: 'reSetUserInfo' });
        // }
      });
    },
  },

  effects: {
    // *init(p, { call, put, select }) {
    //   const { institutionLogo } = yield select(({ app }) => app);
    //   if (!institutionLogo) {
    //     const { data } = yield call(getLogo);
    //     yield put({
    //       type: 'upState',
    //       payload: { institutionLogo: data },
    //     });
    //   }
    // },

    // *reSetUserInfo(p, { call, put, select }) {
    //   const { user } = yield select(({ app }) => app);
    //   if (_.isEmpty(user)) {
    //     // 用户在非根路径的页面刷新了, 如果sessionStorage有user的值就重置state里的user的值
    //     // 否则跳转登录界面
    //     const user = sessionStorage.getItem('user');
    //     if (user) {
    //       yield put({
    //         type: 'upState',
    //         payload: {
    //           user: JSON.parse(user),
    //         },
    //       });
    //     } else {
    //       jump('/');
    //     }
    //   }
    // },
    *login({ payload }, { call, put, all }) {
      // const { data } = yield call(login, payload);
      // if(data) {
      //   const { data: lienceData } = yield call(getLience);
      //   if (lienceData) sessionStorage.setItem('lienceMessage', lienceData);
      // }
      // const roles = _.map(data.roles, ({ code }) => code);
      // 登录成功后, 在sessionStorage里储存用户的roles信息和基本信息
      // setAuthority(roles);
      setAuthority(['admin']);
      const data = yield call(login)
      console.log(data)
      // sessionStorage.setItem('user', JSON.stringify(data));
      // sessionStorage.setItem('roles', JSON.stringify(roles));
      // 在这里做重定向
      // const redirect = menu => {
      //   const allow = _.filter(menu, ({ authority }) => authority)[0];
      //   if (allow) {
      //     return allow.path;
      //   }
      //   return '/';
      // };
      // yield all([
      //   put({
      //     type: 'upState',
      //     payload: { user: data, roles },
      //   }),
      //   jump(redirect(menu())),
      // ]);
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
