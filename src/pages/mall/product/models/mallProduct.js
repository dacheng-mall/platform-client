import _ from 'lodash';
import ptrx from 'path-to-regexp';
import { message } from 'antd';
import { fieldsChange } from '../../../../utils/ui';
import { upload } from '../../../../utils';
import { fetch, update, create, match } from '../../services';

const INIT_STATE = {
  editor: {},
  errors: {},
};

export default {
  namespace: 'mallProduct',
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const pn = ptrx('/mall/product/:id').exec(pathname);
        if (pn) {
          dispatch({
            type: 'init',
            id: pn[1],
          });
        } else {
          dispatch({
            type: 'init',
            id: null,
          });
        }
      });
    },
  },
  state: {
    ...INIT_STATE,
  },
  effects: {
    *init({ id }, { call, put }) {
      if (id) {
        const { data } = yield call(match, id);
        const { id: _id, ...editor } = data;
        if (data) {
          yield put({
            type: 'upState',
            payload: {
              editor,
              id,
            },
          });
        }
      } else {
        yield put({
          type: 'upState',
          payload: {
            ...INIT_STATE,
            id: null,
          },
        });
      }
    },
    *submit({ payload }, { put, select, call, all }) {
      try {
        const editor = _.cloneDeep(payload);
        const todos = {};
        // 处理图片
        _.forEach(editor, (value, key) => {
          switch (key) {
            case 'images': {
              _.forEach(value, (val, i) => {
                if (val && val.originFileObj) {
                  todos[`images[${i}]`] = upload(val.originFileObj);
                  editor.images[i] = '';
                } else if (val.name) {
                  editor.images[i] = val.name;
                }
              });
              break;
            }
            case 'listImage': {
              if (value && value.length > 0 && value[0].originFileObj) {
                todos.listImage = upload(value[0].originFileObj);
                editor.listImage = '';
              }
              break;
            }
            case 'content': {
              _.forEach(value, (val, i) => {
                if (val && val.originFileObj) {
                  todos[`content[${i}]`] = upload(val.originFileObj);
                  editor.content[i] = '';
                } else if (val.name) {
                  editor.content[i] = val.name;
                }
              });
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
        const { id } = yield select(({ mallProduct }) => mallProduct);
        let data;
        if (id) {
          data = yield call(update, { id, ...editor });
        } else {
          data = yield call(create, editor);
        }
        const { id: _id, ..._editor } = data;
        yield put({
          type: 'mallProduct',
          payload: {
            id: _id,
            editor: _editor,
          },
        });
        message.success('编辑成功');
      } catch (error) {
        console.log('error', error);
      }
    },
  },
  reducers: {
    upState: (state, { payload }) => {
      return { ...state, ...payload };
    },
    fieldsChange,
  },
};
