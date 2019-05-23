import _ from 'lodash';
import ptrx from 'path-to-regexp';
import { message } from "antd";
import { fetch as get, exportCSVActivityGift } from '../services/gift';
import { getInstWithoutPage } from '../services/activity';
const PAGE_DEF = { page: 1, pageSize: 7 };

export default {
  namespace: 'activityGift',
  state: {
    data: [],
    pagination: PAGE_DEF,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const pn = ptrx('/activity/:id/gift').exec(pathname);
        if (pn && pn[1]) {
          dispatch({ type: 'init', payload: { ...PAGE_DEF, activityId: pn[1] } });
        }
      });
    },
  },
  effects: {
    *init({ payload }, { put }) {
      yield put({
        type: 'upState',
        payload: {
          activityId: payload.activityId,
        },
      })
      yield put({
        type: 'fetch',
        payload,
      });
    },
    *fetch({ payload }, { put, call, select }) {
      const { institutionId, activityId } = yield select(({ activityGift }) => activityGift);
      const {
        user: { institutionId: userInstId },
      } = yield select(({ app }) => app);
      const params = {
        ...PAGE_DEF,
        ...payload,
        activityId,
      };
      params.institutionId = institutionId || userInstId;
      console.log(params);
      const { data } = yield call(get, params);
      yield put({
        type: 'upState',
        payload: data,
      });
    },
    *searchInst({ payload }, { call, put }) {
      const { data } = yield call(getInstWithoutPage, { name: payload });
      yield put({
        type: 'upState',
        payload: {
          inst: data,
        },
      });
    },
    *reset(p, { put }) {
      yield put({
        type: 'upState',
        payload: {
          institutionId: undefined,
        },
      });
      yield put({
        type: 'fetch',
      });
    },
    *exportCSV(p, { call, put, select }) {
      const { institutionId, activityId } = yield select(
        ({ activityGift }) => activityGift,
      );
      const params = { activityId };
      if (institutionId) {
        params.institutionId = institutionId;
      }
      const { data } = yield call(exportCSVActivityGift, params);
      yield put({
        type: 'fetch',
      });
      if (data && data.url) {
        message.success('导出成功');
        window.location.href = `${window.config.api_prod}${data.url}`;
      } else {
        message.warning(`导出失败-${data}`);
      }
    },
  },
  reducers: {
    upState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
