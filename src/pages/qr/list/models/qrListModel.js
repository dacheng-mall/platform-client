import ptrx from 'path-to-regexp';
import _ from 'lodash';
import { message } from 'antd';
import { getQrs, updateQr, getBatchesWhitoutPage, getTypesWhitoutPage } from '../services';
import { fieldsChange } from '../../../../utils/ui';
import { getApiPreFix } from '../../../../utils/request';

const PAGE_DEF = { page: 1, pageSize: 8 };
const INIT_EDITOR = {
  editor: null,
  errors: {},
};
export default {
  namespace: 'qrList',
  state: {
    data: [],
    pagination: PAGE_DEF,
    ...INIT_EDITOR,
    parents: [],
    keywords: '',
    types: null,
    from: undefined,
    to: undefined,
    bindStatus: undefined,
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
        }
      });
    },
  },

  effects: {
    *init({ id }, { put, all }) {
      yield all([
        put({
          type: 'upState',
          payload: {
            imgPrefix: getApiPreFix(),
          },
        }),
        put({
          type: 'fetchInitData',
          batchId: id,
        }),
        put({
          type: 'fetch',
        }),
      ]);
    },
    *fetchInitData({ batchId }, { call, put }) {
      const { data } = yield call(getBatchesWhitoutPage, { id: batchId });
      if (data.length > 0) {
        const typeId = data[0].typeId;
        const { data: types } = yield call(getTypesWhitoutPage, { id: typeId });
        yield put({
          type: 'upState',
          payload: {
            batch: data[0],
            type: types[0],
            batchId,
            typeId,
          },
        });
      }
    },
    *fetch({ payload }, { put, call, select }) {
      const { from, to, bindStatus } = yield select(({ qrList }) => qrList);
      const params = {};
      if (from) {
        params.from = from;
      }
      if (to) {
        params.to = to;
      }
      if(bindStatus) {
        switch(bindStatus) {
          case 'salesman': {
            params.hasSalesman = true
            break;
          }
          case 'user': {
            params.hasCustom = true
            break;
          }
          case 'both': {
            params.hasCustom = true
            params.hasSalesman = true
            break;
          }
          default: {
            delete params.hasCustom
            delete params.hasSalesman
            return
          }
        }
      }
      const { data } = yield call(getQrs, { ...PAGE_DEF, ...params , ...payload});
      yield put({
        type: 'upState',
        payload: data,
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
        console.log(target);
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
    *reset(p, { put }) {
      yield put({
        type: 'upState',
        payload: {
          from: undefined,
          to: undefined,
          bindStatus: undefined,
        },
      });
      yield put({
        type: 'fetch',
      });
    },
  },
  reducers: {
    upState(state, { payload }) {
      return { ...state, ...payload };
    },
    fieldsChange,
  },
};
