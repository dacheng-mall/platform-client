import ptrx from 'path-to-regexp';
import _ from 'lodash';
import moment from 'moment';
import { message } from 'antd';
import { findInst, createActivity, findGradesByInsId, find, update } from '../services/activity';
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
        type: 'upState',
        payload: {
          editor: INIT_EDITOR,
          errors: INIT_ERRORS,
        },
      });
    },
    *fetch({ id }, { call, put, select }) {
      const {
        data: [data],
      } = yield call(find, { id });
      console.log('data', data)
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
        if (editor.products) {
          const products = [];
          _.forEach(editor.products, (product) => {
            product.img = `${product.mainImageUrl}`;
            product.productId = product.id;
            products.push(product);
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
    *searchInst({ payload }, { call, put }) {
      const { data } = yield call(findInst, payload);
      yield put({
        type: 'upState',
        payload: {
          inst: data,
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
      const { editor: values } = yield select(({ activity }) => activity);
      // 处理图片
      const todos = {};
      let hasModifyImage = false;
      _.forEach(values.images, (img, i) => {
        if (img && img.originFileObj) {
          todos[`images[${i}].url`] = upload(img.originFileObj);
          values.images[i] = {
            url: '',
          };
          hasModifyImage = true;
        } else {
          values.images[i].url = values.images[i]._url;
          delete values.images[i]._url;
          delete values.images[i].uid;
        }
        values.images[i].displayOrder = i;
        values.images[i].isMain = i === 0;
      });
      if (hasModifyImage) {
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
      values.activityType = 'at_gift';
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
        delete product.img;
        delete product.mainImageUrl;
        delete product.title;
        delete product.price;
        delete product.id;
        delete product.status;
      });
      if (values.id) {
        delete values.createTime;
        delete values.customCount;
        delete values.salesmanCount;
        delete values.displayOrder;
        delete values.gifts;
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
