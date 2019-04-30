import ptrx from 'path-to-regexp';
import _ from 'lodash';
import { findInst, createActivity, findGradesByInsId, find, update } from '../services';
import { fieldsChange } from '../../../utils/ui';
import { upload } from '../../../utils';

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
          // console.log('edit activity', pn[1]);
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
      const {data} = yield call(find, {id});
      
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
    *submit({ values }, { put, call, all }) {
      // 处理图片
      const todos = {};
      _.forEach(values.images, (img, i) => {
        if (img && img.originFileObj) {
          todos[`images[${i}].url`] = upload(img.originFileObj);
          values.images[i] = {
            url: '',
          };
        }
        values.images[i].displayOrder = i;
        values.images[i].isMain = i === 0;
      });
      const ups = Object.values(todos);
      const paths = Object.keys(todos);
      if (ups.length > 0) {
        const res = yield all(_.map(ups, (up) => up()));
        _.forEach(paths, (path, i) => {
          _.set(values, path, res[i].key);
        });
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
        delete product.title;
      });
      const { data } = yield call(createActivity, values);

      console.log(values, data);
    },
  },
  reducers: {
    upState(state, { payload }) {
      return { ...state, ...payload };
    },
    fieldsChange,
  },
};
