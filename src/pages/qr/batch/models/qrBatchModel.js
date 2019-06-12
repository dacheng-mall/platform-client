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
  namespace: 'qrBatch',
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
        if (pathname === '/qr/batch') {
          dispatch({ type: 'init', payload: { ...PAGE_DEF } });
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
              id: '000',
              name: '生命保险扫码挪车第一批',
              description: '富德生命赠送挪车码活动',
              typeId: '000',
              typeName: '挪车码',
              total: 50000,
              orderId: '',
              activityId: 'aaa',
              activityName: '感恩十年, 感谢有你',
              institutionId: 'ppp',
              institutionName: '天安人寿河南分公司',
              productId: '2e3493b37c0b488ca20cebeb00b1a02b',
              productName: '超级折叠背包',
              imageUrl: [
                {
                  url:
                    'http://res.idacheng.cn/20190129105915_5004__O1CN01YVRLC922gHy9R9H8Q-1809177149.jpg',
                  name: '20190129105915_5004__O1CN01YVRLC922gHy9R9H8Q-1809177149.jpg',
                },
              ],
              description: '描述在这里',
              status: 1,
              zip: '',
              createTime: '',
              lastModifyTime: '',
              generated: 0
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
