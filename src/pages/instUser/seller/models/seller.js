import _ from 'lodash';
import { message } from 'antd';
import {
  getSellers,
  updateSeller,
  removeSeller,
  getInstWithoutPage,
  findGradesByInsId,
  exportCSVInstitutionSalesman,
} from '../services';

const PAGE_DEF = { page: 1, pageSize: 8 };

export default {
  namespace: 'instSeller',
  state: {
    data: [],
    pagination: PAGE_DEF,
    editor: null,
    errors: {},
    inst: [],
    institutionId: undefined,
    keywords: '',
    grades: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/instUser/salesmans') {
          dispatch({ type: 'init', payload: { ...PAGE_DEF, userType: 4 } });
        }
      });
    },
  },

  effects: {
    *init({ payload }, { put }) {
      yield [
        put({
          type: 'getGrades',
        }),
        put({
          type: 'fetch',
          payload,
        }),
      ];
    },
    *getGrades({ institutionId }, { put, call, select }) {
      const { grades } = yield select(({ instSeller }) => instSeller);
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
    *fetch({ payload }, { put, call, select }) {
      // const {
      //   user: { institutionId },
      // } = yield select(({ app }) => app);
      const { institutionId, gradeId, keywords: name } = yield select(
        ({ instSeller }) => instSeller,
      );
      const params = {
        ...PAGE_DEF,
        name,
        ...payload,
      };
      if (institutionId) {
        params.institutionId = institutionId;
      }
      if (gradeId) {
        params.gradeId = gradeId;
      }
      const { data } = yield call(getSellers, params);
      yield put({
        type: 'upState',
        payload: data,
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
    *remove({ id }, { call, put, select }) {
      const { data } = yield call(removeSeller, id);
      yield put({
        type: 'fetch',
      });
      if (data) {
        const list = yield select(({ instSeller }) => instSeller.data);
        const newList = _.filter(list, ({ id }) => id !== data);
        yield put({
          type: 'upState',
          payload: {
            data: [...newList],
          },
        });
      }
    },
    *changeStatus({ payload }, { call, put, select }) {
      const { data } = yield call(updateSeller, payload);
      if (data) {
        message.success('状态更新成功');
        const list = yield select(({ instSeller }) => instSeller.data);
        const newList = _.map(list, (item) => {
          if (item.id === data.id) {
            item.status = payload.status;
          }
          return item;
        });
        yield put({
          type: 'upState',
          payload: {
            data: newList,
          },
        });
      }
    },
    *searchByKeywords({ payload }, { call, put }) {
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
      const { institutionId, gradeId, keywords: name } = yield select(
        ({ instSeller }) => instSeller,
      );
      const params = { name };
      if (institutionId) {
        params.institutionId = institutionId;
      }
      if (gradeId) {
        params.institutionId = gradeId;
      }
      const { data } = yield call(exportCSVInstitutionSalesman, params);
      yield put({
        type: 'fetch'
      })
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
