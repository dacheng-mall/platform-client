import _ from 'lodash';
import moment from 'moment';
import { message } from 'antd';
import {
  fetch,
  generate,
  update,
  batch,
  exportCSV,
  findCsvData,
  searchInstitutionsByName,
  addPids,
  visitedDetailCSV,
} from '../services';

const PAGE_DEF = { page: 1, pageSize: 10 };

function daley(time = 500) {
  return new Promise((res) => {
    setTimeout(() => {
      res();
    }, time);
  });
}
function parseQuery(query) {
  const body = {};
  const { userName, userCode, mobile, range, enable, status, sn, code, made, name } = query;
  if (_.trim(name)) {
    body.name = name;
  }
  if (_.trim(userName)) {
    body['user.name'] = userName;
  }
  if (_.trim(userCode)) {
    body['user.code'] = userCode;
  }
  if (_.trim(mobile)) {
    body['user.mobile'] = mobile;
  }
  if (_.trim(sn)) {
    body.sn = sn;
  }
  if (_.trim(code)) {
    body.code = code;
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
  if (enable && enable !== 'all') {
    switch (enable) {
      case 'true': {
        body.enable = true;
        break;
      }
      case 'false': {
        body.enable = false;
        break;
      }
      default: {
      }
    }
  }
  if (status && status !== 'all') {
    body.status = status;
  }
  if (made && made !== 'all') {
    body.made = made;
  }
  return body;
}
export default {
  namespace: 'badge',
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/baseManage/badge') {
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
    *generator({ payload, form }, { call, put, select }) {
      try {
        yield put({
          type: 'upState',
          payload: {
            loading: true,
          },
        });
        const { prize, ...values } = payload;
        const body = { ...values };
        if (prize) {
          const { id, name, value } = prize;
          body.prize = { id, name, value };
        }
        const { data } = yield call(generate, body);
        if (!data.errors) {
          message.success(`成功生成${payload.count}个实体工牌!`);
        }
        form.resetFields();
        yield daley(2000);
        yield put({
          type: 'fetch',
          payload: {
            ...PAGE_DEF,
          },
        });
      } catch (error) {
        console.log(error);
      } finally {
        yield put({
          type: 'upState',
          payload: {
            visible: false,
            loading: false,
            query: {},
          },
        });
      }
    },
    *init(p, { put, select }) {
      const { pagination, data, query } = yield select(({ badge }) => badge);
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
        const { query } = yield select(({ badge }) => badge);
        const body = parseQuery(query);
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
    *update({ payload, form }, { call, put, select }) {
      try {
        yield put({
          type: 'upState',
          payload: {
            loading: true,
          },
        });
        const { pagination } = yield select(({ badge }) => badge);
        const body = {};
        _.forEach(payload, (v, k) => {
          if (v !== '' && v !== undefined) {
            body[k] = v;
          }
        });
        yield call(update, body);
        if (form) {
          form.resetFields();
        }
        yield daley(800);
        yield put({
          type: 'fetch',
          payload: {
            page: pagination.page,
            pageSize: pagination.pageSize,
          },
        });
      } catch (error) {
      } finally {
        yield put({
          type: 'upState',
          payload: {
            loading: false,
            visible: false,
            id: null,
          },
        });
      }
    },
    *edit({ payload, form }, { call, put, select }) {
      const { id } = yield select(({ badge }) => badge);
      yield put({
        type: 'update',
        payload: {
          ...payload,
          id,
        },
        form,
      });
    },
    *batch({ payload, form }, { call, put, select }) {
      try {
        yield put({
          type: 'upState',
          payload: {
            loading: true,
          },
        });
        const { query, pagination } = yield select(({ badge }) => badge);
        yield call(batch, { query: parseQuery(query), body: payload });
        form.resetFields();
        yield daley(500);
        yield put({
          type: 'fetch',
          payload: {
            page: pagination.page,
            pageSize: pagination.pageSize,
          },
        });
      } catch (error) {
      } finally {
        yield put({
          type: 'upState',
          payload: {
            loading: false,
            visible: false,
          },
        });
      }
    },
    *getCsvDetail(p, { call, select }) {
      const { query } = yield select(({ badge }) => badge);
      const body = parseQuery(query);
      const { data } = yield call(exportCSV, body);
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
