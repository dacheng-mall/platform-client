import _ from 'lodash';
import { message, Modal } from 'antd';
import {
  visitedCSV,
  getSellers,
  findGradesByCode,
  exportCSV,
  updateSeller,
  searchInstitutionsByName,
  clearSeller,
} from '../services';

const PAGE_DEF = { page: 1, pageSize: 10 };
export default {
  namespace: 'instSeller',
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/instUser/salesmans' || pathname === '/users/salesmans') {
          dispatch({ type: 'init' });
        }
      });
    },
  },
  state: {
    pagination: { ...PAGE_DEF },
    data: [],
    query: {},
    editor: {},
    inst: [],
    instValue: {},
    grades: [],
  },
  effects: {
    *init(p, { put, select }) {
      const { pagination, data, query } = yield select(({ instSeller }) => instSeller);
      const user = JSON.parse(sessionStorage.getItem('user'));
      if (user.userType === 3) {
        // 默认查本机构的
        yield put({
          type: 'upState',
          payload: {
            instCode: user.institution.code,
            userType: user.userType,
            level: user.institution.level,
            query: {
              institution: {
                key: user.institutionId,
                label: user.institutionName,
              },
              ...query,
            },
          },
        });
        yield put({
          type: 'fetchGrade',
          code: user.institution.code,
        });
      }
      if (data.length < 1) {
        yield put({
          type: 'fetch',
          payload: { ...pagination },
        });
      }
    },
    *remove({ payload }, { call, put, select }) {
      try {
        const { removing } = yield select(({ instSeller }) => instSeller);
        if (removing) {
          return;
        }
        yield put({
          type: 'upState',
          payload: {
            removing: true,
          },
        });
        yield call(clearSeller, payload.id);
        yield new Promise((res) => {
          setTimeout(res, 1000);
        });
        message.success('清理成功');
        yield put({
          type: 'fetch',
          payload: {},
        });
        yield put({
          type: 'upState',
          payload: {
            removing: false,
          },
        });
      } catch (error) {
        yield put({
          type: 'upState',
          payload: {
            removing: false,
          },
        });
      }
    },
    *fetch({ payload }, { put, call, select }) {
      console.log('000000');
      try {
        const { query, pagination, instCode } = yield select(({ instSeller }) => instSeller);
        const body = {};
        if (query.isStaff && query.isStaff !== 'all') {
          body.isStaff = query.isStaff;
        }
        if (query.gradeId && query.gradeId !== 'all') {
          body.gradeId = query.gradeId;
        }
        if (query.institution) {
          body.id = query.institution.key;
          body.instCode = instCode;
        } else {
          yield put({
            type: 'upState',
            payload: {
              instCode: undefined,
              root_lv: undefined,
            },
          });
        }
        if (query.name) {
          body.name = query.name;
        }
        if (query.code) {
          body.code = query.code;
        }
        if (query.mobile) {
          body.mobile = query.mobile;
        }
        if (query.range && query.range.length > 0) {
          const [from, to] = query.range;
          if (to.diff(from, 'day') > 92) {
            message.warning('时间范围不能超过92天');
            return;
          }
          body.from = from.format('YYYY-MM-DD 00:00:00');
          body.to = to.format('YYYY-MM-DD 23:59:59');
        }
        const { page, pageSize } = pagination;
        const { data } = yield call(getSellers, { page, pageSize, ...payload, ...body });
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
    *submit({ payload }, { call, put, select }) {
      const { editor } = yield select(({ instSeller }) => instSeller);
      console.log('payload', payload);
      const body = {};
      _.forEach(payload, (val, key) => {
        if (val) {
          switch (key) {
            case 'grade': {
              body.gradeId = payload.grade.key;
              body.gradeName = payload.grade.label;
              break;
            }
            default: {
              body[key] = val;
              break;
            }
          }
        }
      });
      const data = yield call(updateSeller, { id: editor.id, ...body });
      if (data) {
        message.success('更新成功');
        yield put({
          type: 'upState',
          payload: {
            editor: {},
          },
        });
        yield put({
          type: 'fetch',
          payload: {},
        });
      }
    },
    *edit({ payload }, { put }) {
      yield put({ type: 'fetchGrade', code: payload.institution.code });
      yield put({
        type: 'upState',
        payload: {
          editor: payload,
        },
      });
    },
    *fetchGrade({ code }, { call, put, select }) {
      if (!code) {
        yield put({
          type: 'upState',
          payload: {
            grades: [],
            instCode: undefined,
          },
        });
        return;
      }
      const { grades, instCode } = yield select(({ instSeller }) => instSeller);
      if (instCode !== code || grades.length < 1) {
        const { data } = yield call(findGradesByCode, code);
        yield put({
          type: 'upState',
          payload: {
            grades: data,
            instCode: code,
          },
        });
      }
    },
    *searchInst({ name }, { call, put }) {
      const { data } = yield call(searchInstitutionsByName, { name });
      yield put({
        type: 'upState',
        payload: {
          inst: _.map(data, ({ name, id, code }) => ({
            key: id,
            label: name,
            code,
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
      const { query, instCode } = yield select(({ instSeller }) => instSeller);
      const body = {};
      if (query.isStaff && query.isStaff !== 'all') {
        body.isStaff = query.isStaff;
      }
      if (query.gradeId && query.gradeId !== 'all') {
        body.gradeId = query.gradeId;
      }
      if (query.institution) {
        body.id = query.institution.key;
        body.instCode = instCode;
      }
      if (query.name) {
        body.name = query.name;
      }
      if (query.code) {
        body.code = query.code;
      }
      if (query.mobile) {
        body.mobile = query.mobile;
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
