import ptrx from 'path-to-regexp';
import _ from 'lodash';
import { message } from 'antd';
import { getBatches, updateBatch, createBatch, getTypesWhitoutPage } from '../services';
import { fieldsChange } from '../../../../utils/ui';

const PAGE_DEF = { page: 1, pageSize: 10 };
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
    *init({ id }, { put }) {
      yield put({
        type: 'fetch',
        id,
      });
    },
    *fetch({ payload }, { put, call, select }) {
      const { keywords } = yield select(({ institution }) => institution);
      // const { data } = yield call(getBatchs, { ...PAGE_DEF, ...payload, name: keywords });
      yield put({
        type: 'upState',
        // payload: data,
        payload: {
          pagination: {
            page: 1,
            pageSize: 10,
            total: 1,
            pageCount: 1,
          },
          data: [
            {
              id: '0001',
              sn: '1',
              autoId: '0001',
              batchId: '000',
              type: {
                // 根据码类型id获取码类型数据
                id: '',
                name: '挪车码',
                fields: '',
                template: '',
              },
              user: {
                id: '000',
                name: '测试用户',
                avatarUrl: '',
                bindTime: '2019-01-01 12:12',
              },
              salesman: {
                id: '11111',
                name: '测试业务员',
                institutionId: '222',
                institutionName: '测试机构',
                gradeId: '3333',
                gradeName: '测试职级',
                bindTime: '2019-01-01 10:12',
              },
              fields: 'json',
              createTime: '',
              lastmodifyTime: ''
            },
          ],
        },
      });
    },
    *fetchTypes({ payload }, { call, put, select }) {
      const { types } = yield select(({ qrBatch }) => qrBatch);
      if (types) {
        return;
      }
      // const data = yield call(getTypesWhitoutPage, payload);
      // if (data) {
      yield new Promise((res) => {
        setTimeout(() => {
          res();
        }, 1000);
      });
      yield put({
        type: 'upState',
        payload: {
          // types: data,
          types: [
            {
              id: '000',
              name: '挪车码',
            },
          ],
        },
      });
      // }
    },
    *initEditor({ payload }, { put }) {
      const {
        productId,
        productName,
        activityId,
        activityName,
        institutionName,
        institutionId,
        ...editor
      } = payload;
      editor.linked = [];
      if (productId) {
        editor.linked.push({
          id: productId,
          name: productName,
          type: 'product',
          typeName: '商品',
        });
      }
      if (activityId) {
        editor.linked.push({
          id: activityId,
          name: activityName,
          type: 'activity',
          typeName: '活动',
        });
      }
      if (institutionId) {
        editor.linked.push({
          id: institutionId,
          name: institutionName,
          type: 'institution',
          typeName: '机构',
        });
      }
      yield [
        put({
          type: 'upState',
          payload: {
            editor,
          },
        }),
        put({
          type: 'fetchTypes',
        }),
      ];
    },
    *edit({ payload }, { call, put, select }) {
      const { editor } = yield select(({ institution }) => institution);
      const body = _.cloneDeep(payload);
      if (body.status) {
        body.status = 1;
      } else {
        body.status = 0;
      }
      if (body.editable) {
        body.editable = 1;
      } else {
        body.editable = 0;
      }
      if (body.fields.length > 0) {
        body.fieldsd = JSON.stringify(body.fields);
      }
      if (editor.id) {
        body.id = editor.id;
        // yield call(updateType, body);
      } else {
        body.status = 1;
        // yield call(createType, body);
      }
      const { pagination } = yield select(({ institution }) => institution);
      yield put({
        type: 'fetch',
        payload: pagination,
      });
      yield put({
        type: 'closeEditor',
      });
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
    *closeEditor(p, { put }) {
      yield put({
        type: 'upState',
        payload: INIT_EDITOR,
      });
    },
    *changeStatus({ payload }, { call, put, select }) {
      // const { data } = yield call(updateInst, payload);
      // if (data) {
      //   message.success('状态更新成功');
      //   const list = yield select(({ institution }) => institution.data);
      //   const newList = _.map(list, (item) => {
      //     if (item.id === data.id) {
      //       item.status = payload.status;
      //     }
      //     return item;
      //   });
      //   yield put({
      //     type: 'upState',
      //     payload: {
      //       data: newList,
      //     },
      //   });
      // }
    },
  },
  reducers: {
    upState(state, { payload }) {
      return { ...state, ...payload };
    },
    fieldsChange,
  },
};
