import _ from 'lodash';
import { message } from 'antd';
import { getTypes, updateType, createType } from '../services';
import { fieldsChange } from '../../../../utils/ui';

const PAGE_DEF = { page: 1, pageSize: 10 };
const INIT_EDITOR = {
  editor: null,
  errors: {},
};
export default {
  namespace: 'qrType',
  state: {
    data: [],
    pagination: PAGE_DEF,
    ...INIT_EDITOR,
    parents: [],
    keywords: '',
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/qr/type') {
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
      // const { data } = yield call(getTypes, { ...PAGE_DEF, ...payload, name: keywords });
      yield put({
        type: 'upState',
        // payload: data,
        payload: {
          pagination: {},
          data: [
            {
              id: '000',
              name: '挪车码',
              description: '用于扫码挪车, 记录用户电话号和车牌号',
              status: 1,
              editable: 1,
              fields: [
                {
                  code: 'numberPlate',
                  label: '车牌号',
                  help: "例如'京A88888'",
                  required: false,
                },
                {
                  code: 'mobile',
                  label: '手机号',
                  help: "例如'13213199999'",
                  required: true,
                },
                {
                  code: 'name',
                  label: '称呼',
                  help: "例如'王先生'",
                  required: false,
                },
              ],
            },
          ],
        },
      });
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
    // *remove({ id }, { call, put, select }) {
    //   const { data } = yield call(removeInst, id);
    //   if (data) {
    //     const list = yield select(({ institution }) => institution.data);
    //     const newList = _.filter(list, ({ id }) => id !== data.id);
    //     yield put({
    //       type: 'upState',
    //       payload: {
    //         data: [...newList],
    //       },
    //     });
    //     yield put({
    //       type: 'closeEditor',
    //     });
    //   }
    // },
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
