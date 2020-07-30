import _ from 'lodash';
import moment from 'moment';
import { message } from 'antd';
import {
  fetch,
  visitedCSV,
  findCsvData,
  searchInstitutionsByName,
  addPids,
  visitedDetailCSV,
  transfer,
  fixData,
} from '../services';

const PAGE_DEF = { page: 1, pageSize: 10 };

export default {
  namespace: 'visited',
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/baseManage/visited') {
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
    *tansfer(p, { call }) {
      yield call(transfer);
    },
    *init(p, { put, select }) {
      const { pagination, data, query } = yield select(({ visited }) => visited);

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
        const { query, pagination } = yield select(({ visited }) => visited);
        const body = {};
        const { institution, range, isNewCustomer, category } = query;
        if (institution) {
          [body.pids] = institution.key.split(',');
        }
        if (range && range.length > 0) {
          const [from, to] = range;
          if (to.diff(from, 'day') > 92) {
            message.warning('时间范围不能超过92天');
            return;
          }
          body.from = from.format('YYYY-MM-DD');
          body.to = to.format('YYYY-MM-DD');
        }
        if (isNewCustomer && isNewCustomer !== 'all') {
          switch (isNewCustomer) {
            case 'new': {
              body.isNewCustomer = true;
              break;
            }
            case 'old': {
              body.isNewCustomer = false;
              break;
            }
            default: {
            }
          }
        }
        if (category && category !== 'all') {
          body.category = category;
        }
        const { data } = yield call(fetch, {
          page: PAGE_DEF.page,
          pageSize: PAGE_DEF.pageSize,
          ...payload,
          ...body,
        });
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
    *getcsvdata(p, { call, select }) {
      const { query } = yield select(({ visited }) => visited);
      if (!query.institution) {
        message.error('机构信息缺失');
        return;
      }
      if (!query.range) {
        message.error('请选择时间段');
        return;
      }
      const body = {};
      const { institution, range, type, method } = query;
      if (institution) {
        body.institutionName = institution.label;
        [body.pids, body.level] = institution.key.split(',');
      }
      if (range && range.length > 0) {
        const [from, to] = query.range;
        if (to.diff(from, 'day') > 92) {
          message.warning('时间范围不能超过92天');
          return;
        }
        body.from = from.format('YYYY-MM-DD');
        body.to = to.format('YYYY-MM-DD');
      }
      if (type) {
        body.type = type;
      }
      if (method) {
        body.type = method;
      }
      const { data } = yield call(findCsvData, body);
      if (data && data.url) {
        message.success('导出成功');
        window.location.href = `${window.config.api_prod}${data.url}`;
      } else {
        message.warning(`导出失败-${data}`);
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
    *addPids(p, { call }) {
      const { data } = yield call(addPids);
      console.log(data);
    },
    *fixData(p, { call }) {
      const { data } = yield call(fixData);
      console.log('data', data);
    },
    *getCsvDetail(p, { call, select }) {
      const { query } = yield select(({ visited }) => visited);
      const body = {};
      if (query.category && query.category !== 'all') {
        body.category = query.category;
      }
      // if (query.category && query.category !== 'all') {
      //   if (!body.institution) {
      //     body.institution = {};
      //   }
      //   body.institution.category = query.category;
      // }
      if (query.institution) {
        const [pids, level] = query.institution.key.split(',');
        body.pids = pids;
        body.level = level;
      }
      if (query.range) {
        const [from, to] = query.range;
        body.from = moment(from).format('YYYY-MM-DD');
        body.to = moment(to).format('YYYY-MM-DD');
      }
      const { data } = yield call(visitedDetailCSV, body);
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
