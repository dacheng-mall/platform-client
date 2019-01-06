import ptrx from 'path-to-regexp';
import _ from 'lodash';
import { getProduct, addProducts } from '../services';
import { fieldsChange } from '../../../utils/ui';
import { upload } from '../../../utils';

export default {
  namespace: 'detail',
  state: {
    editor: {},
    errors: {},
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const pn = ptrx('/products/detail/:id').exec(pathname);
        let id;
        if (pn) {
          id = pn[1];
        }
        dispatch({
          type: 'init',
          id,
        });
      });
    },
  },
  effects: {
    *init({ id }, { call, put }) {
      if (id) {
        const { data } = yield call(getProduct, id);
        yield new Promise(function(res) {
          setTimeout(() => {
            res();
          }, 1000);
        });
        yield put({
          type: 'upState',
          payload: { editor: data },
        });
      } else {
        yield put({
          type: 'upState',
          payload: { editor: {} },
        });
      }
    },
    *submit(p, { call, put, select, all }) {
      const { editor, errors } = yield select(({ detail }) => detail);
      const errorKeys = Object.keys(errors);
      if (errorKeys.length > 0) {
        return;
      }
      console.log('生数据', editor);
      const todos = {};
      _.forEach(editor, (value, name) => {
        // 遍历生数据, 记录图片的path, 并调用图片上传的api
        if(value) {
          switch(name){
            case 'video': {
              _.forEach(value, (val, key) => {
                if(val.originFileObj) {
                  todos[`video[${key}]`] = upload(val.originFileObj)
                }
              })
              break;
            }
            case 'images': {
              _.forEach(value, (val, i) => {
                if(val.originFileObj) {
                  todos[`images[${i}].name`] = upload(val.originFileObj);
                  editor.images[i] = {
                    type: 'image',
                    name: '',
                  }
                }
              })
              break;
            }
            case 'content': {
              _.forEach(value, (val, i) => {
                if(val.type === 'image') {
                  if(val.value.originFileObj) {
                    todos[`content[${i}].value`] = upload(val.value.originFileObj)
                  }
                }
              })
              break;
            }
            default: {
              break;
            }
          }
        }
      })
      const ups = Object.values(todos);
      const paths = Object.keys(todos);
      const res = yield all(_.map(ups, (up) => up()));
      _.forEach(paths, (path, i) => {
        _.set(editor, path, res[i].key);
      });
      if(editor.content) {
        editor.content = JSON.stringify(editor.content)
      }
      if(editor.information) {
        editor.information = JSON.stringify(editor.information)
      }
      editor.status = 1
      console.log('editor', editor);
      const {data} = yield call(addProducts, editor)
      console.log('add product', data);
    },
  },
  reducers: {
    upState(state, { payload }) {
      return { ...state, ...payload };
    },
    fieldsChange,
  },
};
