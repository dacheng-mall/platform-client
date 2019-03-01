import ptrx from 'path-to-regexp';
import router from 'umi/router';
import _ from 'lodash';
import { message } from 'antd';
import { upload } from '../../../utils';
import { fieldsChange } from '../../../utils/ui';
import { addCmsElement, updateCmsElement, getCmsElementsWithoutPage } from '../services';
const INIT_STATE = {
  editor: {},
  errors: {},
};

export default {
  namespace: 'elementEditor',
  state: {
    ...INIT_STATE,
    data: [],
    attributes: {},
    name: '',
    type: '',
    count: 0,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const pn = ptrx('/cms/element/:id').exec(pathname);
        if (pn) {
          const id = pn[1];
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
  effects: {
    *init({ id }, { put, call }) {
      if (id) {
        const { data: res } = yield call(getCmsElementsWithoutPage, { id });
        if (res.length > 0) {
          res[0].data = JSON.parse(res[0].data);
          res[0].attributes = res[0].attributes && JSON.parse(res[0].attributes);
          if(res[0].type === 'grid') {
            if(!res[0].attributes.cols) {
              res[0].attributes.cols = 4
            }
            if(!res[0].attributes.rows) {
              res[0].attributes.rows = 2
            }
          }
          yield put({
            type: 'upState',
            payload: res[0],
          });
        }
      } else {
        yield put({
          type: 'upState',
          payload: {
            data: [],
            name: '',
            type: '',
            createTime: null,
            lastModifyDate: null,
            id: null,
            count: null,
            status: 1,
          },
        });
      }
    },
    *change({ payload }, { put, select }) {
      const { value, index, type } = payload;
      let { data, name, type: listType, attributes } = yield select(({ elementEditor }) => elementEditor);
      switch (type) {
        case 'edit': {
          data[index] = value;
          break;
        }
        case 'add': {
          if (listType === 'list') {
            data.push({ size: 1 });
          } else {
            data.push({});
          }
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
          const preFix = /^attributes\./;
          if (preFix.test(type)) {
            const path = type.replace(preFix, '');
            _.set(attributes, path, value);
          }
          break;
        }
      }
      yield put({
        type: 'upState',
        payload: {
          data: _.cloneDeep(data),
          name,
          attributes,
        },
      });
    },
    *submit(p, { put, call, select, all }) {
      const elementEditor = yield select(({ elementEditor }) => elementEditor);
      const listData = _.cloneDeep(elementEditor);
      _.remove(listData.data, (item) => {
        return !item || !item.id;
      });
      if (!listData.data || listData.data.length < 1) {
        message.error('没有可以提交的内容');
        return;
      }
      const todos = {};
      _.forEach(listData.data, (d, i) => {
        if (d.fileList) {
          if (d.fileList[0] && d.fileList[0].originFileObj) {
            // 新上传了元素图, 覆盖了商品图
            todos[`[${i}].image`] = upload(d.fileList[0].originFileObj);
          }
          delete d.fileList;
        }
      });

      const ups = Object.values(todos);
      const paths = Object.keys(todos);
      if (ups.length > 0) {
        const res = yield all(_.map(ups, (up) => up()));
        _.forEach(paths, (path, i) => {
          _.set(listData.data, path, res[i].key);
        });
      }
      listData.count = listData.data.length;
      _.forEach(listData.data, (d) => {
        _.forEach(d, (val, key) => {
          if (val === undefined) {
            delete d[key];
          }
        });
      });
      listData.data = JSON.stringify(listData.data);
      listData.attributes = JSON.stringify(listData.attributes);

      delete listData.createTime;
      delete listData.lastModifyDate;
      delete listData.attr;
      let id;
      if (!listData.id) {
        delete listData.id;
        const { data } = yield call(addCmsElement, listData);
        message.success('添加素材操作成功')
        id = data.id;
      } else {
        const { data } = yield call(updateCmsElement, listData);
        message.success('更新素材操作成功')
        id = data.id;
      }
      yield put({
        type: 'init',
        id,
      });
    },
    *goBack(p, {put}){
      yield put({
        type: 'upstate',
        payload: {
          data: [],
          attributes: {},
          name: '',
          type: '',
          count: 0,
        }
      })
      router.go(-1)
    }
  },
  reducers: {
    upState(state, { payload }) {
      return { ...state, ...payload };
    },
    fieldsChange
  },
};
