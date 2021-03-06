import _ from 'lodash';
import ptrx from 'path-to-regexp';
import { message } from 'antd';
import { fetch as get, exportCSVActivitySalesman } from '../services/team';
import { findGradesByInsId, getInstWithoutPage } from '../services/activity';
const PAGE_DEF = { page: 1, pageSize: 8 };

export default {
  namespace: 'activityTeam',
  state: {
    data: [],
    grades: [],
    pagination: PAGE_DEF,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const pn = ptrx('/activity/:id/team').exec(pathname);
        if (pn && pn[1]) {
          console.log('pn[1]', pn[1]);
          dispatch({ type: 'init', payload: { ...PAGE_DEF, activityId: pn[1] } });
        }
      });
    },
  },
  effects: {
    *init({ payload }, { put }) {
      yield put({
        type: 'upState',
        payload: { activityId: payload.activityId },
      });
      yield [
        put({
          type: 'fetch',
          payload,
        }),
        put({
          type: 'getGrades',
        }),
      ];
    },
    *fetch({ payload }, { put, call, select }) {
      const { institutionId, gradeId, keywords: name } = yield select(
        ({ activityTeam }) => activityTeam,
      );
      const { institutionId: userInstId } = yield select(({ app }) => app.user);
      const params = {
        ...PAGE_DEF,
        name,
        ...payload,
      };
      params.institutionId = institutionId || userInstId;
      if (gradeId) {
        params.gradeId = gradeId;
      }
      const { data } = yield call(get, params);
      if (data.data.length > 0) {
        data.data = _.map(data.data, ({ salesman }) => salesman);
      }
      yield put({
        type: 'upState',
        payload: data,
      });
    },
    *getGrades({ institutionId }, { put, call, select }) {
      const { grades } = yield select(({ activityTeam }) => activityTeam);
      if (grades.length > 0) {
        return;
      }
      const { user } = yield select(({ app }) => app);
      const { data } = yield call(findGradesByInsId, institutionId || user.institutionId);
      yield put({
        type: 'upState',
        payload: {
          grades: data,
        },
      });
    },
    *reset(p, { put }) {
      yield put({
        type: 'upState',
        payload: {
          keywords: '',
          institutionId: undefined,
          gradeId: undefined,
        },
      });
      yield put({
        type: 'fetch',
      });
    },
    *searchByKeywords({ payload }, { put }) {
      yield put({
        type: 'upState',
        payload: {
          keywords: payload,
        },
      });
      yield put({
        type: 'fetch',
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
    *exportCSV(p, { call, put, select }) {
      const { institutionId, gradeId, activityId } = yield select(
        ({ activityTeam }) => activityTeam,
      );
      const params = { activityId };
      if (institutionId) {
        params.institutionId = institutionId;
      }
      if (gradeId) {
        params.institutionId = gradeId;
      }
      const { data } = yield call(exportCSVActivitySalesman, params);
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
