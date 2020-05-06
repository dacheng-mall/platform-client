import _ from 'lodash';
import moment from 'moment';
import { message } from 'antd';
import {
  fetch,
  switchActive,
  remove,
  visitedCSV,
  findCsvData,
  getInstitutionsWhitoutPage,
  addPids,
} from '../services';

const PAGE_DEF = { page: 1, pageSize: 6 };

export default {
  namespace: 'onlineVisitedEntry',
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/baseManage/onlineVisitedEntry') {
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
    _switch: false,
    _delete: false
  },
  effects: {
    *init({ force }, { put, select }) {
      console.log('force', force);
      const { pagination, data } = yield select(({ onlineVisitedEntry }) => onlineVisitedEntry);
      if (data.length < 1 || force) {
        yield put({
          type: 'fetch',
          payload: { ...pagination },
        });
      }
    },
    *deleteItem({ id }, { call, put, select }) {
      try {
        const { _delete } = yield select(({ onlineVisitedEntry }) => onlineVisitedEntry);
        if (_delete) {
          message.warning('请稍后...');
          return;
        }
        yield put({
          type: 'upState',
          payload: {
            _delete: true,
          },
        });
        yield call(remove, id);
        yield new Promise((res) => {
          setTimeout(() => {
            res();
          }, 2000);
        });
        yield put({
          type: 'init',
          force: true,
        });
        yield put({
          type: 'upState',
          payload: {
            _delete: false,
          },
        });
      } catch (error) {
        message.error(error);
      }
    },
    *changeEnable({ payload }, { call, put, select }) {
      try {
        const { _switch } = yield select(({ onlineVisitedEntry }) => onlineVisitedEntry);
        if (_switch) {
          message.warning('请稍后...');
          return;
        }
        yield put({
          type: 'upState',
          payload: {
            _switch: true,
          },
        });
        const { data } = yield call(switchActive, payload);
        console.log('切换入口成功', data);
        message.success('切换入口成功');
        yield new Promise((res) => {
          setTimeout(() => {
            res();
          }, 2000);
        });
        yield put({
          type: 'init',
          force: true,
        });
        yield put({
          type: 'upState',
          payload: {
            _switch: false,
          },
        });
      } catch (error) {
        message.error(error);
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
      console.log('fetch', payload);
      try {
        const { query } = yield select(({ onlineVisitedEntry }) => onlineVisitedEntry);
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
