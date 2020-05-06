import _ from 'lodash';
import moment from 'moment';
import { message } from 'antd';
import {
  fetch,
  visitedCSV,
  getInstitutionsWhitoutPage,
  addPids,
  attendanceDetailCSV,
  searchInstitutionsByName,
} from '../services';

const PAGE_DEF = { page: 1, pageSize: 6 };

export default {
  namespace: 'hello',
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/baseManage/attendance') {
          dispatch({ type: 'init' });
        }
      });
    },
  },
  state: {
    pagination: { ...PAGE_DEF },
    data: [],
    query: {},
    inst: [],
    instValue: {},
  },
  effects: {
    *init(p, { put, select }) {
      const { pagination, data, query } = yield select(({ hello }) => hello);
      const user = JSON.parse(sessionStorage.getItem('user'));
      if (user.userType === 3) {
        // 默认查本机构的
        yield put({
          type: 'upState',
          payload: {
            userType: user.userType,
            query: {
              institution: {
                key: `${user.institution.autoId},${user.institution.level}`,
                label: user.institutionName,
              },
              ...query,
            },
          },
        });
      }
      if (data.length < 1) {
        yield put({
          type: 'fetch',
          payload: { ...pagination },
        });
      }
    },
    *fetch({ payload }, { put, call, select }) {
      try {
        const { query, pagination } = yield select(({ hello }) => hello);
        const body = {};
        if (query.type && query.type !== 'all') {
          body.type = query.type;
        }
        if (query.institution) {
          const [pids] = query.institution.key.split(',');
          body.pids = pids;
        }
        if (query.range && query.range.length > 0) {
          const [from, to] = query.range;
          if (to.diff(from, 'day') > 92) {
            message.warning('时间范围不能超过92天');
            return;
          }
          body.from = from.format('YYYY-MM-DD');
          body.to = to.format('YYYY-MM-DD');
        }
        if (query.userCode) {
          body['user.code'] = query.userCode;
        }
        if (query.userName) {
          body['user.name'] = query.userName;
        }
        if (query.masterCode) {
          body['master.code'] = query.masterCode;
        }
        const { page, pageSize } = pagination;
        const { data } = yield call(fetch, { page, pageSize, ...payload, ...body });
        yield put({
          type: 'upState',
          payload: {
            ...data,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
    *searchInst({ name }, { call, put }) {
      const { data } = yield call(searchInstitutionsByName, { name });
      yield put({
        type: 'upState',
        payload: {
          inst: _.map(data, ({ name, autoId, level }) => ({
            key: `${autoId},${level}`,
            label: name,
          })),
        },
      });
    },
    *visitedCSV({ payload }, { call }) {
      const { data } = yield call(visitedCSV, payload);
      if (data && data.url) {
        message.success('导出成功');
        window.location.href = `${window.config.api_prod}${data.url}`;
      } else {
        message.warning(`导出失败-${data}`);
      }
      console.log(data);
    },
    *getCsvDetail(p, { call, select }) {
      const { query } = yield select(({ hello }) => hello);
      const body = {};
      if (query.type && query.type !== 'all') {
        body.type = query.type;
      }
      if (query.institution) {
        const [pids] = query.institution.key.split(',');
        body.pids = pids;
      }
      if (query.range && query.range.length > 0) {
        const [from, to] = query.range;
        if (to.diff(from, 'day') > 92) {
          console.log(to.diff(from, 'day'))
          message.warning('时间范围不能超过92天');
          return;
        }
        body.from = from.format('YYYY-MM-DD');
        body.to = to.format('YYYY-MM-DD');
      }
      if (query.userCode) {
        body['user.code'] = query.userCode;
      }
      if (query.userName) {
        body['user.name'] = query.userName;
      }
      if (query.userCode) {
        body['master.code'] = query.masterCode;
      }
      const { data } = yield call(attendanceDetailCSV, body);
      if (data && data.url) {
        message.success('导出成功');
        window.location.href = `${window.config.api_prod}${data.url}`;
      } else {
        message.warning(`导出失败-${data}`);
      }
      console.log(data);
    },
  },
  reducers: {
    upState: (state, { payload }) => {
      return { ...state, ...payload };
    },
  },
};
