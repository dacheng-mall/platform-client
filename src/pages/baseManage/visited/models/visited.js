import _ from 'lodash';
import moment from 'moment';
import { message } from 'antd';
import {
  fetch,
  update,
  visitedCSV,
  findCsvData,
  getInstitutionsWhitoutPage,
  addPids,
} from '../services';

const PAGE_DEF = { page: 1, pageSize: 6 };

export default {
  namespace: 'visited',
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/baseManage/visited') {
          // dispatch({ type: 'init' });
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
      const { pagination, data } = yield select(({ task }) => task);
      if (data.length < 1) {
        yield put({
          type: 'fetch',
          payload: { ...pagination },
        });
      }
    },
    *getcsvdata({ isActive }, { call, select }) {
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
      body.institutionName = institution.label;
      [body.pids, body.level] = institution.key.split(',');
      [body.from, body.to] = range;
      body.from = moment(body.from).format('YYYY-MM-DDT00:00:00');
      body.to = moment(body.to).format('YYYY-MM-DDT23:59:59');
      if (type && !isActive) {
        body.type = type;
      }
      if (method && !isActive) {
        body.type = method;
      }
      if (isActive) {
        body.isActive = true;
      } else {
        body.isActive = false;
      }
      const { data } = yield call(findCsvData, body);
      if (data && data.url) {
        message.success('导出成功');
        window.location.href = `${window.config.api_prod}${data.url}`;
      } else {
        message.warning(`导出失败-${data}`);
      }
    },
    *fetch({ payload }, { put, call, select }) {
      try {
        const { query } = yield select(({ task }) => task);
        const { data } = yield call(fetch, { ...payload, query });
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
      const { data } = yield call(getInstitutionsWhitoutPage, { name });
      console.log('data', data);
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
      console.log('--------', data);
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
  },
  reducers: {
    upState: (state, { payload }) => {
      return { ...state, ...payload };
    },
  },
};
