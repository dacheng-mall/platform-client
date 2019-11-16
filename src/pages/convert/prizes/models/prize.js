import _ from 'lodash';
import ptrx from 'path-to-regexp';
import { message } from 'antd';
import { fieldsChange } from '../../../../utils/ui';
import { upload } from '../../../../utils';
import { createPrize, updatePrize, getPrize } from '../service';

const INIT_STATE = {
  editor: {},
  errors: {},
  isNew: true,
};
export default {
  namespace: 'prize',
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const pn = ptrx('/convert/prize/:id').exec(pathname);
        let id;
        if (pn) {
          id = pn[1];
          dispatch({
            type: 'init',
            id,
          });
        } else {
          dispatch({
            type: 'init',
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
          type: 'fetchPrize',
          id,
        });
      }
    },
    *fetchPrize({ id }, { call, put }) {
      try {
        const { data } = yield call(getPrize, id);
        yield put({
          type: 'upState',
          payload: {
            editor: data._source,
            id,
          },
        });
      } catch (error) {}
    },
    *submit(p, { call, select, all }) {
      const { editor: _editor, id } = yield select(({ prize }) => prize);
      const editor = _.cloneDeep(_editor);
      const todos = {};
      // 处理图片
      _.forEach(editor, (val, key) => {
        switch (key) {
          case 'coverImg':
          case 'contentImg':
          case 'posterImg': {
            if (val && val.length > 0 && val[0].originFileObj) {
              todos[key] = upload(val[0].originFileObj);
              editor[key] = '';
            }
            break;
          }
        }
      });
      const ups = Object.values(todos);
      const paths = Object.keys(todos);
      if (ups.length > 0) {
        const res = yield all(_.map(ups, (up) => up()));
        _.forEach(paths, (path, i) => {
          _.set(editor, path, res[i].key);
        });
      }
      if (!id) {
        try {
          yield call(createPrize, editor);
          message.success('新建成功');
        } catch (error) {}
      } else {
        // 这里执行更新的逻辑
        try {
          yield call(updatePrize, editor, id);
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
