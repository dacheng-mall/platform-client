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
      const { keywords } = yield select(({ qrType }) => qrType);
      const { data } = yield call(getTypes, { ...PAGE_DEF, ...payload, name: keywords });
      yield put({
        type: 'upState',
        payload: data,
        
      });
    },
    /* 
    <ul style="margin:0; padding:0">
<li style="position:relative;padding-left:64px"><span style="width:64px">车牌号: </span>{{license}}</li>
<li style="position:relative;padding-left:64px"><span style="width:64px">称呼: </span>{{name}}</li>
</ul>__|||__call */
    *edit({ payload }, { call, put, select }) {
      const { editor } = yield select(({ qrType }) => qrType);
      const body = _.cloneDeep(payload);
      if (body.status) {
        body.status = 1;
      } else {
        body.status = 0;
      }
      if (body.bindSalesman) {
        body.bindSalesman = 1;
      } else {
        body.bindSalesman = 0;
      }
      if (body.fields.length > 0) {
        body.fields = JSON.stringify(body.fields);
      } else {
        body.fields = ''
      }
      if (editor.id) {
        body.id = editor.id;
        yield call(updateType, body);
      } else {
        body.status = 1;
        yield call(createType, body);
      }
      const { pagination } = yield select(({ qrType }) => qrType);
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
      const { data } = yield call(updateType, payload);
      if (data) {
        message.success('状态更新成功');
        const list = yield select(({ qrType }) => qrType.data);
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
  },
  reducers: {
    upState(state, { payload }) {
      return { ...state, ...payload };
    },
    fieldsChange,
  },
};
