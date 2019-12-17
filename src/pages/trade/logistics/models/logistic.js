import _ from 'lodash';
import ptrx from 'path-to-regexp';
import { message } from 'antd';
import { fieldsChange } from '../../../../utils/ui';
// import { upload } from '../../../../utils';
import { createPrize, updatePrize, getTemplate, createTemplate, updateTemplate } from '../services';

const INIT_STATE = {
  editor: {
    billingType: 'count',
  },
  errors: {},
};
export default {
  namespace: 'logistic',
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const pn = ptrx('/trade/logistics-template/editor/:id').exec(pathname);
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
      console.log(id);
      if (id) {
        yield put({
          type: 'fetch',
          id,
        });
      }
    },
    *fetch({ id }, { call, put }) {
      try {
        const { data } = yield call(getTemplate, id);
        if (data.id) {
          if (data.respond) {
            data.respond = {
              label: data.respond.name,
              key: data.respond.code,
            };
          }
          let regionName = ''
          if (data.origin) {
            regionName = data.origin.name
            data.origin = data.origin.code.split(' ');
          }
          yield put({
            type: 'upState',
            payload: {
              editor: data,
              id: data.id,
              regionName
            },
          });
        }
      } catch (error) {
        console.log(error)
      }
    },
    *submit(p, { call, select }) {
      const { editor: _editor, id, regionName } = yield select(({ logistic }) => logistic);
      const editor = _.cloneDeep(_editor);
      if (editor.respond) {
        editor.respond = {
          name: editor.respond.label,
          code: editor.respond.key,
        };
      }
      if (editor.origin) {
        editor.origin = {
          code: editor.origin.join(' '),
          name: regionName,
        };
      }
      if (!id) {
        try {
          yield call(createTemplate, editor);
          message.success('新建成功');
        } catch (error) {}
      } else {
        try {
          yield call(updateTemplate, editor);
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
