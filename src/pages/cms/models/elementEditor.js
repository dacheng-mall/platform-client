import ptrx from 'path-to-regexp';
import router from 'umi/router';
import _ from 'lodash';
import { message } from 'antd';
import { upload } from '../../../utils';
import { fieldsChange } from '../../../utils/ui';
import { addCmsElement, updateCmsElement, getCmsElementsWithoutPage } from '../services';
import { getProductsList } from '../../products/services';
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
          res[0].attributes = res[0].attributes && JSON.parse(res[0].attributes);
          if (res[0].type !== 'products') {
            res[0].data = JSON.parse(res[0].data);
          } else {
            const _query = {};
            _.forEach(res[0].attributes, (v, k) => {
              if (k === 'min') {
                if (!_query.price) {
                  _query.price = [];
                }
                _query.price[0] = v;
              }
              if (k === 'max') {
                if (!_query.price) {
                  _query.price = [];
                }
                _query.price[1] = v;
              }
              if (k === 'cateId') {
                _query.cateId = v;
              }
            });
            const { data: _list } = yield call(getProductsList, _query);
            res[0].data = _list;
          }
          if (res[0].type === 'grid') {
            if (!res[0].attributes.cols) {
              res[0].attributes.cols = 4;
            }
            if (!res[0].attributes.rows) {
              res[0].attributes.rows = 2;
            }
          }
          if (res[0].type === 'article') {
            const { data, ...other } = res[0];
            yield put({
              type: 'upState',
              payload: {
                ...other,
                editor: { content: data },
              },
            });
          } else {
            yield put({
              type: 'upState',
              payload: res[0],
            });
          }
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
    *change({ payload }, { put, call, select }) {
      const { value, index, type } = payload;
      let { data, name, type: listType, attributes } = yield select(
        ({ elementEditor }) => elementEditor,
      );
      const gernaral = {};
      switch (type) {
        case 'edit': {
          data[index] = value;
          break;
        }
        case 'submitQuery': {
          const _query = {};
          if (attributes.min > 0 && attributes.max > 0) {
            if (attributes.min > attributes.max) {
              _query.price = [attributes.max, attributes.min];
              attributes.min = _query.price[0];
              attributes.max = _query.price[1];
              message.warning('上线值和下限值翻转');
            } else {
              _query.price = [attributes.min, attributes.max];
            }
          } else if (attributes.min > 0) {
            attributes.max = attributes.min;
            attributes.min = 0;
            _query.price = [attributes.min, attributes.max];
          } else if (attributes.max > 0) {
            attributes.min = 0;
            _query.price = [attributes.min, attributes.max];
          }
          if (attributes.id) {
            _query.cateId = attributes.id;
          }
          if (!_query.cateId && !_query.price) {
            message.error(`至少有一个筛选条件(分类或价格区间)`);
            return;
          }
          const { data: _list } = yield call(getProductsList, _query);
          if (_list.length === 0) {
            message.warning(`根据筛选条件, 没有合适的商品`);
          } else {
            data = _list;
          }
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
        case 'query': {
          const { value: valueX, type: typeX } = value;
          if (typeX === 'category') {
            attributes = { ...attributes, ...valueX };
          } else {
            attributes[typeX] = valueX;
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
        case 'userType':
        case 'split':
        case 'breakLine':
        case 'itemHeight':
        case 'gutter': {
          gernaral[type] = value;
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
          ...gernaral,
        },
      });
    },
    *submitArticle({ payload }, { put, call, all }) {
      const data = _.cloneDeep(payload);
      const todos = {};
      _.forEach(data.data, (val, i) => {
        if (val.type === 'image') {
          if (val.value.originFileObj) {
            todos[i] = upload(val.value.originFileObj);
          }
        }
      });
      const ups = Object.values(todos);
      const paths = Object.keys(todos);
      if (ups.length > 0) {
        const res = yield all(_.map(ups, (up) => up()));
        _.forEach(paths, (path, i) => {
          _.set(data.data, `${path}.value`, res[i].key);
        });
      }
      let id;
      data.data = JSON.stringify(data.data);
      if (!data.id) {
        delete data.id;
        const { data: res } = yield call(addCmsElement, data);
        message.success('添加素材操作成功');
        id = res.id;
      } else {
        const { data: res } = yield call(updateCmsElement, data);
        message.success('更新素材操作成功');
        id = res.id;
      }
      yield put({
        type: 'init',
        id,
      });
    },
    *submit(p, { put, call, select, all }) {
      const elementEditor = yield select(({ elementEditor }) => elementEditor);
      let listData = _.cloneDeep(elementEditor);
      _.remove(listData.data, (item) => {
        if (item.type === 'path') {
          return !item.path;
        } else {
          return !item || !item.id;
        }
      });
      if (listData.type !== 'article' && (!listData.data || listData.data.length < 1)) {
        message.error('没有可以提交的内容');
        return;
      }
      if (listData.type === 'article' && listData.editor.content.length < 1) {
        message.error('没有可以提交的内容');
        return;
      }
      if (listData.type === 'article') {
        yield put({
          type: 'submitArticle',
          payload: {
            data: listData.editor.content,
            id: elementEditor.id,
            name: elementEditor.name,
            type: 'article',
            status: 1,
            count: listData.editor.content.length,
          },
        });
        return;
      }
      delete listData.editor;
      delete listData.errors;
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
      _.forEach(listData.data, (d) => {
        _.forEach(d, (val, key) => {
          if (val === undefined) {
            delete d[key];
          }
        });
      });
      if (listData.type === 'products') {
        listData.count = 0;
        listData.data = '';
      } else {
        listData.count = listData.data.length;
        listData.data = JSON.stringify(listData.data);
      }
      listData.attributes = JSON.stringify(listData.attributes);
      delete listData.createTime;
      delete listData.lastModifyDate;
      delete listData.attr;
      let id;
      if (!listData.id) {
        delete listData.id;
        const { data } = yield call(addCmsElement, listData);
        message.success('添加素材操作成功');
        id = data.id;
      } else {
        const { data } = yield call(updateCmsElement, listData);
        message.success('更新素材操作成功');
        id = data.id;
      }
      yield put({
        type: 'init',
        id,
      });
    },
    *goBack(p, { put }) {
      yield put({
        type: 'upstate',
        payload: {
          data: [],
          attributes: {},
          name: '',
          type: '',
          count: 0,
        },
      });
      router.go(-1);
    },
  },
  reducers: {
    upState(state, { payload }) {
      return { ...state, ...payload };
    },
    clear() {
      return {
        ...INIT_STATE,
        data: [],
        attributes: {},
        name: '',
        type: '',
        count: 0,
      };
    },
    fieldsChange,
  },
};
