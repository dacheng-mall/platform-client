import _ from 'lodash';
import { message } from 'antd';
import {
  getBatches,
  updateBatch,
  createBatch,
  getTypesWhitoutPage,
  generate,
  download,
  supply,
} from '../services';
import { fieldsChange } from '../../../../utils/ui';
import { upload } from '../../../../utils';

const source = window.config.source;

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
      const { keywords } = yield select(({ qrBatch }) => qrBatch);
      const { data } = yield call(getBatches, { ...PAGE_DEF, ...payload, name: keywords });
      yield put({
        type: 'upState',
        payload: data,
      });
    },
    *fetchTypes({ payload }, { call, put, select }) {
      const { types } = yield select(({ qrBatch }) => qrBatch);
      if (types) {
        return;
      }
      const { data } = yield call(getTypesWhitoutPage, payload);
      if (data) {
        yield put({
          type: 'upState',
          payload: {
            types: _.map(data, ({ name, id }) => ({ name, id })),
          },
        });
      }
    },
    *generate({ payload }, { call, put }) {
      const { data } = yield call(generate, payload);
      if (data.status === 1) {
        message.success('开始生成二维码图片, 请稍候刷新页面', 5);
        yield put({
          type: 'fetch',
        });
      } else if (data.status === 2) {
        message.error('生成图片失败, 请重新生成', 5);
        yield put({
          type: 'fetch',
        });
      }
    },
    *download({ payload }, { call, select, put }) {
      const { data } = yield call(download, payload); // console.log(data)
      if (data.id && data.autoId) {
        message.success('正在压缩, 稍后请刷新页面查看最新的压缩状态')
        const { data: list } = yield select(({ qrBatch }) => qrBatch);
        const target = _.find(list, ['id', data.id]);
        if(target) {
          target.zipStatus = 1;
          yield put({
            type: 'upState',
            payload: {
              data: [...list]
            }
          })
        }
      }
    },
    *check({ payload }, { call, select, put }) {
      const { data } = yield call(supply, payload);
      if (data.id) {
        message.success('正在检查, 稍后请刷新页面查看最新的检查状态')
        const { data: list } = yield select(({ qrBatch }) => qrBatch);
        const target = _.find(list, ['id', payload.id]);
        if(target) {
          target.checkQRStatus = 1;
          yield put({
            type: 'upState',
            payload: {
              data: [...list]
            }
          })
        }
      }
    },
    *initEditor({ payload }, { put }) {
      const {
        productId,
        productName,
        activityId,
        activityName,
        institutionName,
        institutionId,
        imageUrl,
        ...editor
      } = payload;
      editor.linked = [];
      if (productId) {
        editor.linked.push({
          id: productId,
          name: editor.product.title,
          type: 'product',
          typeName: '商品',
        });
      }
      if (activityId) {
        editor.linked.push({
          id: activityId,
          name: editor.activity.name,
          type: 'activity',
          typeName: '活动',
        });
      }
      if (institutionId) {
        editor.linked.push({
          id: institutionId,
          name: editor.institution.name,
          type: 'institution',
          typeName: '机构',
        });
      }
      // 回填图片
      if (imageUrl) {
        const images = [
          {
            _url: imageUrl,
            url: `${source}${imageUrl}`,
            displayOrder: 0,
          },
        ];
        editor.images = images;
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
    *edit({ payload }, { call, all, put, select }) {
      const { editor } = yield select(({ qrBatch }) => qrBatch);
      const body = _.cloneDeep(payload);
      // 处理图片
      const todos = {};
      let hasModifyImage = false;
      if (body.images && body.images.length < 1) {
        body.imageUrl = null;
      } else {
        _.forEach(body.images, (img, i) => {
          if (img && img.originFileObj) {
            todos[`images[${i}].url`] = upload(img.originFileObj);
            body.images[i] = {
              url: '',
            };
            hasModifyImage = true;
          } else {
            body.images[i].url = body.images[i]._url;
            delete body.images[i]._url;
            delete body.images[i].uid;
          }
        });
        if (hasModifyImage) {
          const ups = Object.values(todos);
          const paths = Object.keys(todos);
          if (ups.length > 0) {
            const res = yield all(_.map(ups, (up) => up()));
            _.forEach(paths, (path, i) => {
              _.set(body, path, res[i].key);
            });
            body.imageUrl = body.images[0].url;
          }
        } else {
          delete body.imageUrl;
        }
      }
      delete body.images;
      // 图片处理完毕
      // 处理关联实体, 先清掉, 再赋值
      body.productId = null;
      body.activityId = null;
      body.orderId = null;
      body.institutionId = null;

      if (body.linked.length > 0) {
        _.forEach(body.linked, ({ type, id }) => {
          body[`${type}Id`] = id;
        });
      }
      delete body.linked;
      if (editor.id) {
        body.id = editor.id;
        yield call(updateBatch, body);
      } else {
        body.status = 0;
        body.from = 1;
        yield call(createBatch, body);
      }
      const { pagination } = yield select(({ qrBatch }) => qrBatch);
      yield put({
        type: 'fetch',
        payload: pagination,
      });
      yield put({
        type: 'closeEditor',
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
    *closeEditor(p, { put }) {
      yield put({
        type: 'upState',
        payload: INIT_EDITOR,
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
