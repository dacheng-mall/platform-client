import _ from 'lodash';
import * as qiniu from 'qiniu-js';
import { login, getQiniuToken, logout } from '../services/app';
import { jump } from '../utils';
import { setAuthority } from '../utils/authority';
import { menu } from '../pages/_layouts/menuData';
import { setToken } from '../utils/request';
import { TYPES } from '../../src/pages/cms/element';
import { getRegionData } from '../services/dict';

const redirect = (menu) => {
  const allow = _.find(menu, ({ authority }) => authority || undefined);
  const makePath = (item, prefix = '/') => {
    if (item.children && item.children.length > 0) {
      return makePath(item.children[0], `${item.path}/`);
    }
    return `${prefix}${item.path}`;
  };
  if (allow) {
    return makePath(allow);
  }
  return '/';
};
export default {
  namespace: 'app',

  state: {
    institutionLogo: null,
    user: {},
    roles: [],
    dict: {
      elementsTypes: _.map(TYPES, (type, i) => {
        type.id = `elemType_${i}`;
        return type;
      }),
    },
    qiniu: {},
    region: [],
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
        const token = sessionStorage.getItem('token');
        if (user && token) {
          yield setToken(() => `Bearer ${token}`);
          yield put({
            type: 'upState',
            payload: {
              user: JSON.parse(user),
              menu: menu(),
              token,
            },
          });
        } else {
          jump('/');
        }
      }
    },
    *getRegion(p, { call, put, select }) {
      const { region } = yield select(({ app }) => app);
      if (region.length < 1) {
        const { data } = yield call(getRegionData);
        const group = _.groupBy(data, ({ pid }) => pid);
        const res = group.null;
        function dg(nodes) {
          _.forEach(nodes, (node) => {
            const children = group[node.id];
            if (children && children.length > 0) {
              dg(children);
            }
            node.children = children;
          });
        }
        dg(res);
        yield put({
          type: 'upState',
          payload: {
            region: res,
          },
        });
      }
    },
    *login({ payload }, { call, put, all }) {
      const { data } = yield call(login, payload);
      if (data) {
        sessionStorage.setItem('user', JSON.stringify(data.user));
        sessionStorage.setItem('token', data.token);
        setAuthority(data.user.userType);
        const _menu = menu();
        yield put({
          type: 'upState',
          payload: { ...data, menu: _menu },
        });
        yield setToken(() => `Bearer ${data.token}`);
        yield jump(redirect(_menu));
      }
    },
    *getQiniuToken(p, { call, put, select }) {
      const { deadline } = yield select(({ app }) => app.qiniu);
      const now = new Date().valueOf();
      if (!deadline || deadline <= now) {
        const { data } = yield call(getQiniuToken);
        if (data.code === 0) {
          const { uploadToken, deadline } = data.data;
          yield put({
            type: 'upState',
            payload: { qiniu: { uploadToken, deadline: now + deadline } },
          });
        }
      }
    },
    *upload({ payload }, { call, put, select }) {
      const { uploadToken, deadline } = yield select(({ app }) => app.qiniu);
      const now = new Date().valueOf();
      let token = uploadToken;
      if (!deadline || deadline <= now) {
        const { data } = yield call(getQiniuToken);
        if (data.code === 0) {
          const { uploadToken, deadline } = data.data;
          yield put({
            type: 'upState',
            payload: { qiniu: { uploadToken, deadline: now + deadline } },
          });
          token = uploadToken;
        }
      }
      const { file } = payload;
      const keymaker = () => {
        const d = new Date().format('yyyyMMddhhmmss');
        const random = parseInt(Math.random() * 10000, 10);
        return d + random + file.name;
      };

      const observable = qiniu.upload(file, keymaker(), token);

      observable.subscribe(
        (res) => {
          console.log('subscription-next', res);
        },
        (res) => {
          console.log('subscription-error', res);
        },
        (res) => {
          console.log('subscription-complete', res);
        },
      );
    },
    *logout(p, { put, call }) {
      const { error } = yield call(logout);
      if (!error) {
        sessionStorage.clear();
        jump('/');
        yield put({
          type: 'upState',
          payload: { user: {} },
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
