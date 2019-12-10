import _ from 'lodash';
import ptrx from 'path-to-regexp';
import { message } from 'antd';
import { fieldsChange } from '../../../../utils/ui';
// import { upload } from '../../../../utils';
import { createPrize, updatePrize, getPrize } from '../services';

const INIT_STATE = {
  editor: {
    billingType: "count"
  },
  errors: {}
};
export default {
  namespace: 'logistic',
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const pn = ptrx('/logisitic-template/:id').exec(pathname);
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
  state: {
    ...INIT_STATE,
  },
  effects: {
    *init({ id }, { put }) {
      if (id) {
        yield put({
          type: 'fetch',
          id,
        });
      }
    },
    *fetch({ id }, { call, put }) {
      try {
        const { data } = yield call(getPrize, id);
        if (data.id) {
          yield put({
            type: 'upState',
            payload: {
              editor: data,
              id: data.id,
            },
          });
        }
      } catch (error) {}
    },
    *submit(p, { call, select, all }) {
      const { editor: _editor, id } = yield select(({ prize }) => prize);
      const editor = _.cloneDeep(_editor);
      // const todos = {};
      if (!id) {
        try {
          yield call(createPrize, editor);
          message.success('新建成功');
        } catch (error) {}
      } else {
        // 这里执行更新的逻辑
        try {
          yield call(updatePrize, editor);
          message.success('更新成功');
        } catch (error) {}
      }
    },
  },
  reducers: {
    upState: (state, { payload }) => {
      return { ...state, ...payload };
    },
    clear: (state) => {
      return { ...state, ...INIT_STATE };
    },
    fieldsChange,
  },
};
