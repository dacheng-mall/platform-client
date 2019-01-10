import ptrx from 'path-to-regexp';
import _ from 'lodash';
import { getProduct, addProducts } from '../services';
import { fieldsChange } from '../../../utils/ui';
import { upload } from '../../../utils';
import { source } from "../../../../setting";

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
        if (data.length > 0) {
          const editor = data[0];
          if (editor.content) {
            editor.content = JSON.parse(editor.content);
            _.forEach(editor.content, cont => {
              if(cont.type === 'image') {
                cont.value = `${source}${cont.value}`
              }
            })
          }
          if (editor.attributes) {
            editor.attributes = JSON.parse(editor.attributes);
          }
          if (editor.information) {
            editor.information = JSON.parse(editor.information);
          }
          if (editor.images) {
            const images = [];
            let video = {};
            _.forEach(editor.images, (image) => {
              if(image.type === 'image') {
                image.url = `${source}${image.name}`
                images.push(image);
              }
              if(image.type === 'video') {
                if(image.name) {
                  image.name = `${source}${image.name}`
                }
                if(image.poster) {
                  image.poster = `${source}${image.poster}`
                }
                video = image;
              }
            })
            editor.images = images;
            editor.video = video;
          }
          yield put({
            type: 'upState',
            payload: { editor },
          });
        }
      } else {
        yield put({
          type: 'upState',
          payload: { editor: {} },
        });
      }
    },
    *submit(p, { call, put, select, all }) {
      const { editor, errors } = yield select(({ detail }) => detail);
      const { user } = yield select(({ app }) => app);
      const errorKeys = Object.keys(errors);
      if (errorKeys.length > 0) {
        return;
      }
      const todos = {};
      _.forEach(editor, (value, name) => {
        // 遍历生数据, 记录图片的path, 并调用图片上传的api
        if (value) {
          debugger
          switch (name) {
            case 'video': {
              _.forEach(value, (val, key) => {
                if (val && val.originFileObj) {
                  todos[`video[${key}]`] = upload(val.originFileObj);
                }
              });
              break;
            }
            case 'images': {
              _.forEach(value, (val, i) => {
                if (val && val.originFileObj) {
                  todos[`images[${i}].name`] = upload(val.originFileObj);
                  editor.images[i] = {
                    type: 'image',
                    name: '',
                  };
                }
              });
              break;
            }
            case 'content': {
              _.forEach(value, (val, i) => {
                if (val.type === 'image') {
                  if (val.value.originFileObj) {
                    todos[`content[${i}].value`] = upload(val.value.originFileObj);
                  }
                }
              });
              break;
            }
            default: {
              break;
            }
          }
        }
      });
      const ups = Object.values(todos);
      const paths = Object.keys(todos);
      const res = yield all(_.map(ups, (up) => up()));
      _.forEach(paths, (path, i) => {
        _.set(editor, path, res[i].key);
      });
      if (editor.content) {
        editor.content = JSON.stringify(editor.content);
      }
      if (editor.information) {
        editor.information = JSON.stringify(editor.information);
      }
      if (editor.attributes) {
        editor.attributes = JSON.stringify(editor.attributes);
      }
      editor.status = 1;
      if (editor.images && editor.images.length > 0) {
        editor.mainImageUrl = editor.images[0].name;
      }
      if (user.userType === 1) {
        editor.isSelf = true;
      }
      if(editor.id) {
        console.log('修改', editor)
      } else {
        const { data } = yield call(addProducts, editor);
        if(data) {
          yield put({
            type: 'init',
            id: editor.id
          })
        }
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
