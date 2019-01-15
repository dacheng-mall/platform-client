import ptrx from 'path-to-regexp';
import _ from 'lodash';
import { message } from 'antd';
import { getCmsElements } from '../services';
import { upload } from '../../../utils';
import { addCmsElement } from '../services';

export default {
  namespace: 'elementEditor',
  state: {
    data: [],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const pn = ptrx('/cms/element/:id').exec(pathname);
        if (pn) {
          // const typeCode = pn[1];
          const id = pn[1];
          dispatch({
            type: 'init',
            id,
          });
        }
      });
    },
  },
  effects: {
    *init({ id }, { put, call }) {
      if (id) {
        const { data } = yield call(getCmsElements, { id });
        yield put({
          type: 'upState',
          payload: {
            ...data,
          },
        });
      }
    },
    *change({ payload }, { put, select }) {
      const { value, index, type } = payload;
      let { data, name } = yield select(({ elementEditor }) => elementEditor);
      switch (type) {
        case 'edit': {
          data[index] = value;
          break;
        }
        case 'add': {
          data.push({ size: 1 });
          break;
        }
        case 'move': {
          let position;
          switch (value) {
            case 'up': {
              position = index - 1;
              break;
            }
            case 'down': {
              position = index + 1;
              break;
            }
            default: {
              break;
            }
          }
          const target = data.splice(index, 1)[0];
          data.splice(position, 0, target);
          break;
        }
        case 'del': {
          data = _.filter(data, (d, i) => i !== index);
          break;
        }
        case 'title': {
          name = value;
          break;
        }
        default: {
          break;
        }
      }
      yield put({
        type: 'upState',
        payload: {
          data: [...data],
          name,
        },
      });
    },
    *submit(p, { put, call, select, all }) {
      const elementEditor = yield select(({ elementEditor }) => elementEditor);
      const listData = _.cloneDeep(elementEditor.data);
      _.remove(listData, ({ productId }) => !productId);
      if (!listData || listData.length < 1) {
        message.error('没有可以提交的内容');
        return;
      }

      const todos = {};
      _.forEach(listData, (d, i) => {
        if (d.fileList && d.fileList[0]) {
          if (d.fileList[0].originFileObj) {
            // 新上传了元素图, 覆盖了商品图
            todos[`[${i}].mainImage`] = upload(d.fileList[0].originFileObj);
          }
          delete d.fileList;
        }
      });

      const ups = Object.values(todos);
      const paths = Object.keys(todos);
      if (ups.length > 0) {
        const res = yield all(_.map(ups, (up) => up()));
        _.forEach(paths, (path, i) => {
          _.set(listData, path, res[i].key);
        });
      }
      elementEditor.data = JSON.stringify(listData);
      console.log('final elementEditor: ', elementEditor);
      if (!elementEditor.id) {
        const { data } = yield call(addCmsElement, elementEditor);
        console.log('添加后的返回值', data);
      }
    },
  },
  reducers: {
    upState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
