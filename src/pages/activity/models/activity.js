import ptrx from 'path-to-regexp';
import _ from 'lodash';
import moment from 'moment';
import { message } from 'antd';
import {
  findInst,
  createActivity,
  findGradesByInsId,
  find,
  update,
  findTypes,
} from '../services/activity';
import { fieldsChange } from '../../../utils/ui';
import { upload } from '../../../utils';

const source = window.config.source;

const INIT_EDITOR = Object.create(null);
const INIT_ERRORS = Object.create(null);

export default {
  namespace: 'activity',
  state: {
    editor: INIT_EDITOR,
    errors: INIT_ERRORS,
    inst: [],
    grades: [],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const pn = ptrx('/activity/:id').exec(pathname);
        if (pathname === '/activity') {
          dispatch({
            type: 'newActivity',
          });
        } else if (pn) {
          dispatch({
            type: 'fetch',
            id: pn[1],
          });
        }
      });
    },
  },
  effects: {
    *newActivity(p, { put }) {
      yield put({
        type: 'fetchTypes',
      });
      yield put({
        type: 'upState',
        payload: {
          editor: INIT_EDITOR,
          errors: INIT_ERRORS,
          isNew: true,
        },
      });
    },
    *fetch({ id }, { call, put }) {
      yield put({
        type: 'fetchTypes',
      });
      yield put({
        type: 'upState',
        payload: {
          isNew: false,
        },
      });
      const {
        data: [data],
      } = yield call(find, { id });
      try {
        data.description = JSON.parse(data.description);
      } catch (e) {
        console.log(e);
      }
      if (data) {
        const { institution, production, ...editor } = data;
        // 回填职级
        editor.grades = editor.grades.split(',');
        // 回填时间周期
        editor.range = [moment(editor.dateStart), moment(editor.dateEnd)];
        // 回填图片
        if (editor.images) {
          const images = [];
          _.forEach(editor.images, (image) => {
            image._url = image.url;
            image.url = `${source}${image.url}`;
            images[image.displayOrder || 0] = image;
          });
          editor.images = images;
        }
        // 回填关联商品
        if (editor.activityProducts) {
          editor.products = [];
          _.forEach(editor.activityProducts, (product) => {
            product.img = `${product.product.mainImageUrl}`;
            product.productId = product.id;
            editor.products.push(product);
            delete product._pivot_activityId;
            delete product._pivot_productId;
          });
        }
        // 请求职级选项
        yield [
          put({
            type: 'getGrades',
            institutionId: institution.id,
          }),
          put({
            type: 'upState',
            payload: {
              editor,
              inst: [institution],
            },
          }),
        ];
      }
    },
    *fetchTypes(p, { call, put, select }) {
      const { types, typeTimestamp } = yield select(({ activity }) => activity);
      const now = new Date().valueOf();
      if (!types || now - typeTimestamp > 3600000) {
        const { data } = yield call(findTypes);
        if (data) {
          yield put({
            type: 'upState',
            payload: {
              types: data,
              typeTimestamp: now,
            },
          });
        }
      }
    },
    *searchInst({ payload }, { call, put }) {
      const { data } = yield call(findInst, payload);
      yield put({
        type: 'upState',
        payload: {
          inst: data,
        },
      });
    },
    *changeInst({ payload }, { call, put, select }) {
      let institutionName = '';
      const { inst } = yield select(({ activity }) => activity);
      if (payload) {
        institutionName = _.find(inst, ['id', payload]).name
      }
      yield put({
        type: 'upState',
        payload: {
          institutionName
        },
      });
    },
    *getGrades({ institutionId }, { put, call }) {
      const { data } = yield call(findGradesByInsId, institutionId);
      yield put({
        type: 'upState',
        payload: {
          grades: data,
        },
      });
    },
    *clearGrades(p, { put }) {
      yield put({
        type: 'upState',
        payload: {
          grades: [],
        },
      });
    },
    *submit(p, { call, all, select, put }) {
      const { editor: values, institutionName } = yield select(({ activity }) => activity);
      values.institutionName = institutionName
      // 处理图片
      const todos = {};
      _.forEach(values.images, (img, i) => {
        if (img && img.originFileObj) {
          todos[`images[${i}].url`] = upload(img.originFileObj);
          values.images[i] = {
            url: '',
          };
        } else {
          values.images[i].url = values.images[i]._url;
          delete values.images[i]._url;
          delete values.images[i].uid;
        }
        values.images[i].displayOrder = i;
        values.images[i].isMain = i === 0;
      });
      _.forEach(values.description, (val, i) => {
        if (val.type === 'image') {
          if (val.value.originFileObj) {
            todos[`description[${i}].value`] = upload(val.value.originFileObj);
          }
        }
      });
      if (!_.isEmpty(todos)) {
        const ups = Object.values(todos);
        const paths = Object.keys(todos);
        if (ups.length > 0) {
          const res = yield all(_.map(ups, (up) => up()));
          _.forEach(paths, (path, i) => {
            _.set(values, path, res[i].key);
          });
        }
      } else {
        delete values.images;
      }
      // 处理时间区间
      const [dateStart, dateEnd] = values.range;
      values.dateStart = dateStart.format('YYYY-MM-DD HH:mm:ss');
      values.dateEnd = dateEnd.format('YYYY-MM-DD HH:mm:ss');
      delete values.range;
      // 处理职级
      values.grades = values.grades && values.grades.join(',');
      // 处理绑定商品
      _.forEach(values.products, (product, i) => {
        product.displayOrder = i;
        if (product.range) {
          const [beginTime, finishTime] = product.range;
          product.beginTime = moment(beginTime).format('YYYY-MM-DD HH:mm:ss');
          product.finishTime = moment(finishTime).format('YYYY-MM-DD HH:mm:ss');
          delete product.range;
        }
        delete product.img;
        delete product.mainImageUrl;
        delete product.title;
        if (!values.id) {
          product.leftStock = product.stock;
        }
        product.status = 'waiting';
      });
      values.description = JSON.stringify(values.description);
      if (values.id) {
        delete values.createTime;
        delete values.customCount;
        delete values.salesmanCount;
        delete values.displayOrder;
        delete values.gifts;
        delete values.products;
        delete values.activityProducts;
        const { data } = yield call(update, values);
        message.success('修改成功');
        if (data) {
          yield put({
            type: 'fetch',
            id: values.id,
          });
        }
      } else {
        const { data } = yield call(createActivity, values);
        message.success('新建成功');
        if (data) {
          yield put({
            type: 'newActivity',
          });
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
