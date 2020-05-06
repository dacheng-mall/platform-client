import _ from 'lodash';
import { message } from 'antd';
import moment from 'moment';
import {
  getAttestation,
  excute,
  updateAdmin,
  removeAdmin,
  createAdmin,
  getInstWithoutPage,
  getInstitutionsWhitoutPage,
  getInstitutionsForInstAdminWhitoutPage,
} from '../services';

import { parseEditor } from '../../../../utils/ui';

const PAGE_DEF = { page: 1, pageSize: 8 };
const DEF_QUERY = {
  range: undefined,
  name: undefined,
  isStaff: false,
  mobile: undefined,
  institutionId: undefined,
  status: null,
};

export default {
  namespace: 'attestation',
  state: {
    data: [],
    pagination: PAGE_DEF,
    editor: null,
    errors: {},
    inst: [],
    ...DEF_QUERY,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/users/attestation') {
          dispatch({ type: 'init', payload: PAGE_DEF });
        }
      });
    },
  },

  effects: {
    *init({ payload }, { put }) {
      yield put({
        type: 'fetch',
        payload,
      });
    },
    *fetch({ payload }, { put, call, select }) {
      console.log(payload);
      const { range, institutionId, name, isStaff, mobile, status } = yield select(
        ({ attestation }) => attestation,
      );
      const params = {};
      if (range && range.length > 0) {
        params.from = moment(range[0]).format('YYYY-MM-DD 00:00:00');
        params.to = moment(range[1]).format('YYYY-MM-DD 23:59:59');
      }
      if (institutionId) {
        params['apply.institutionId'] = institutionId;
      }
      if (name) {
        params['apply.name'] = name;
      }
      if (isStaff) {
        params['apply.gradeName'] = '内勤';
      }
      if (mobile) {
        params['apply.mobile'] = mobile;
      }

      if (status) {
        params['status'] = status;
      }
      const { data } = yield call(getAttestation, { ...PAGE_DEF, ...payload, ...params });
      yield put({
        type: 'upState',
        payload: data,
      });
    },
    *reset(p, { put }) {
      yield put({
        type: 'upState',
        payload: DEF_QUERY,
      });
    },
    *excute({ payload }, { call, select, put }) {
      try {
        const { type } = payload;
        const { editor } = yield select(({ attestation }) => attestation);
        const body = {
          id: editor.id,
        };
        switch (type) {
          case 'refuse': {
            body.result = 'refuse';
            body.reason = [editor.reason];
            break;
          }
          case 'accept':
          case 'invalid':
          case 'onStaff':
          case 'reExcute': {
            body.result = type;
            break;
          }
        }
        const id = yield call(excute, body);
        yield put({
          type: 'upState',
          payload: {
            editor: null,
          },
        });
        yield put({
          type: 'fetch',
        });
      } catch (error) {
        message.error(JSON.parse(error).message);
        yield put({
          type: 'upState',
          payload: {
            editor: null,
          },
        });
      }
    },
    *fetchInst({ payload }, { put, select, call }) {
      const { userType, institutionId: id } = yield select(({ app }) => app.user);
      let data;
      if (userType === 3) {
        // 机构管理员查子机构
        const res = yield call(getInstitutionsForInstAdminWhitoutPage, { ...payload, id });
        data = res.data;
      } else if (userType === 1) {
        // 平台管理员查全部
        const res = yield call(getInstitutionsWhitoutPage, payload);
        data = res.data;
      }
      yield put({
        type: 'upState',
        payload: {
          institutions: data,
        },
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
    *changeReason({ payload }, { put, select }) {
      const { reason } = payload;
      const { editor } = yield select(({ attestation }) => attestation);
      yield put({
        type: 'upState',
        payload: {
          editor: { ...editor, reason },
        },
      });
    },
  },
  reducers: {
    upState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
