import ptrx from 'path-to-regexp';
import _ from 'lodash';
import moment from 'moment';
import { message } from 'antd';
import {
  getQrs,
  updateQr,
  getBatchesWhitoutPage,
  getTypesWhitoutPage,
  getInstitutionsWhitoutPage,
  getInstitutionsForInstAdminWhitoutPage,
  exportCSV,
} from '../services';
import { fieldsChange } from '../../../../utils/ui';
import { getRootPreFix, getApiPreFix } from '../../../../utils/request';

const PAGE_DEF = { page: 1, pageSize: 8 };

export default {
  namespace: 'qrList',
  state: {
    data: [],
    pagination: PAGE_DEF,
    parents: [],
    keywords: '',
    types: null,
    from: undefined,
    to: undefined,
    bindStatus: undefined,
    institutionId: undefined,
    range: undefined,
    typeId: undefined,
    batchId: '',
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const pn = ptrx('/qr/list/:batchId').exec(pathname);
        let id;
        if (pn) {
          id = pn[1];
          dispatch({
            type: 'init',
            id,
          });
        } else if (pathname === '/qr/listAll') {
          dispatch({
            type: 'init4son',
          });
        }
      });
    },
  },

  effects: {
    *init({ id }, { put, all }) {
      yield put({
        type: 'upState',
        payload: {
          from: undefined,
          to: undefined,
          institutionId: undefined,
          bindStatus: undefined,
          typeId: undefined,
          imgPrefix: getApiPreFix(),
          batchId: id,
          range: undefined,
          isRoot: false,
        },
      });
      yield all([
        put({
          type: 'fetchInitData',
          batchId: id,
        }),
        put({
          type: 'fetch',
          payload: { batchId: id },
        }),
      ]);
    },
    *init4son(p, { put, select, all }) {
      const { user } = yield select(({ app }) => app);
      yield put({
        type: 'upState',
        payload: {
          institutionId: user.institutionId,
          institutions: [user.institution],
          from: undefined,
          to: undefined,
          bindStatus: undefined,
          typeId: undefined,
          imgPrefix: getApiPreFix(),
          batchId: undefined,
          range: undefined,
          isRoot: false,
        },
      });
      yield all([
        put({
          type: 'fetchInit2',
        }),
        put({
          type: 'fetch',
        }),
      ]);
    },
    *fetchInit2(p, { call, put }) {
      const { data: types } = yield call(getTypesWhitoutPage, { status: 1, bindSalesman: 1 });
      yield put({
        type: 'upState',
        payload: {
          types,
          isRoot: false,
        },
      });
    },
    *fetchInitData({ batchId }, { call, put, select }) {
      const { data } = yield call(getBatchesWhitoutPage, { id: batchId });
      if (data.length > 0) {
        const typeId = data[0].typeId;
        const now = new Date().valueOf();
        const { timestamp, types: _types, user } = yield select(({ qrList, app }) => ({
          ...qrList,
          user: app.user,
        }));
        let isRoot = false;
        if (user.institutionId === data[0].institutionId || user.userType === 1) {
          isRoot = true;
        }
        const { data: types } = yield call(getTypesWhitoutPage, { id: typeId });
        yield put({
          type: 'upState',
          payload: {
            batch: data[0],
            type: types[0],
            batchId,
            typeId,
            timestamp: now,
            isRoot,
          },
        });
      }
    },
    *fetch({ payload }, { put, call, select }) {
      const { from, to, bindStatus, batchId, range, institutionId, getRange } = yield select(
        ({ qrList }) => qrList,
      );
      const params = {};
      if (batchId) {
        params.batchId = batchId;
      }
      if (from) {
        params.from = from;
      }
      if (to) {
        params.to = to;
      }
      if (institutionId) {
        params.institutionId = institutionId;
      }
      if (range && range.length > 0) {
        params.fromTime = moment(range[0]).format('YYYY-MM-DD 00:00:00');
        params.toTime = moment(range[1]).format('YYYY-MM-DD 23:59:59');
      }
      if (getRange && getRange.length > 0) {
        params.fromGet = moment(getRange[0]).format('YYYY-MM-DD 00:00:00');
        params.toGet = moment(getRange[1]).format('YYYY-MM-DD 23:59:59');
      }
      if (bindStatus) {
        switch (bindStatus) {
          case 'salesman': {
            params.hasSalesman = true;
            break;
          }
          case 'user': {
            params.hasCustom = true;
            break;
          }
          case 'both': {
            params.hasCustom = true;
            params.hasSalesman = true;
            break;
          }
          default: {
            delete params.hasCustom;
            delete params.hasSalesman;
            return;
          }
        }
      }
      if (payload === 'exportCsv') {
        const { data } = yield call(exportCSV, params);
        if (data && data.url) {
          window.location.href = `${getApiPreFix()}${data.url}`;
        }
      } else {
        const { data } = yield call(getQrs, { ...PAGE_DEF, ...params, ...payload });
        yield put({
          type: 'upState',
          payload: data,
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
    *clearQr({ id }, { call, put, select }) {
      const params = {
        id,
        userId: null,
        salesmanId: null,
        fields: null,
        salesmanBindTime: null,
        userBindTime: null,
      };
      const { data } = yield call(updateQr, params);
      if (data.id) {
        message.success('重置成功!');
        const list = yield select(({ qrList }) => _.cloneDeep(qrList.data));
        const target = _.find(list, ['id', data.id]);
        target.custom = {};
        target.salesman = {};
        target.fields = null;
        target.salesmanBindTime = null;
        target.salesmanId = null;
        target.userBindTime = null;
        target.userId = null;
        yield put({
          type: 'upState',
          payload: { data: list },
        });
      }
    },
    *clear(p, { put }) {
      yield put({
        type: 'upState',
        payload: {
          from: undefined,
          to: undefined,
          institutionId: undefined,
          bindStatus: undefined,
          typeId: undefined,
          batchId: undefined,
          range: undefined,
          getRange: undefined,
          isRoot: false,
        },
      });
    },
    *reset(p, { put, select }) {
      const { batchId } = yield select(({ qrList }) => qrList);
      const { user } = yield select(({ app }) => app);
      if (batchId) {
        yield put({
          type: 'fatch',
          id: batchId,
        });
      } else {
        yield put({
          type: 'init4son',
        });
      }
    },
  },
  reducers: {
    upState(state, { payload }) {
      return { ...state, ...payload };
    },
    fieldsChange,
  },
};
