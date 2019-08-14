import _ from 'lodash';
import { message } from 'antd';
import {
  fetch as get,
  update,
  find,
  getActivityproducts,
  removeActivityproducts,
} from '../services/activity';

const PAGE_DEF = { page: 1, pageSize: 10 };

export default {
  namespace: 'activities',
  state: {
    data: [],
    pagination: PAGE_DEF,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/activities/list') {
          dispatch({ type: 'init', payload: { ...PAGE_DEF } });
        }
        if (pathname === '/instActivity') {
          dispatch({ type: 'initWithInstitution', payload: { ...PAGE_DEF } });
        }
      });
    },
  },
  effects: {
    *init({ payload }, { put }) {
      yield put({
        type: 'fetch',
        payload,
      });
    },
    *initWithInstitution({ payload }, { put }) {
      yield put({
        type: 'fetch',
        payload,
        isInstitutionAdmin: true,
      });
    },
    *fetch({ payload, isInstitutionAdmin }, { put, call, select }) {
      const { keywords } = yield select(({ activities }) => activities);
      const params = { ...PAGE_DEF, ...payload, name: keywords };
      // if(isInstitutionAdmin) {
      //   const { user } = yield select(({ app }) => app);
      // }
      const { data } = yield call(get, params);
      yield put({
        type: 'upState',
        payload: { ...data, isInstitutionAdmin },
      });
    },
    *remove({ payload }, { call, put, select }) {
      const { data } = yield call(removeActivityproducts, payload.id);
      if (data) {
        const { data: list } = yield select(({ activities }) => activities);
      }
    },
    *edit({ payload }, { put, call, select }) {
      const { data } = yield select(({ activities }) => activities);
      const target = _.find(data, ['id', payload.activityId]);

      const {
        data: [product],
      } = yield call(getActivityproducts, {
        activityId: payload.activityId,
        id: payload.data.id,
      });
      switch (payload.type) {
        case 'create': {
          if (_.isArray(target.products)) {
            target.products.push(product);
          } else {
            target.products = [product];
          }
          break;
        }
        case 'update': {
          const index = _.findIndex(target.products, ['id', payload.data.id]);
          if (index !== -1) {
            target.products[index] = product;
          }
          break;
        }
      }
      yield put({
        type: 'upState',
        payload: {
          data: [...data],
        },
      });
    },
    *getActivityProduct({ payload }, { put, call, select }) {
      const { data } = yield call(getActivityproducts, payload);
      if (data.length > 0) {
        _.forEach(data, (d) => {
          delete d.activity;
        });
        const { data: list } = yield select(({ activities }) => activities);
        const target = _.find(list, ['id', payload.activityId]);
        target.products = data;
        yield put({
          type: 'upState',
          payload: {
            data: [...list],
          },
        });
      }
    },
    *changeStatus({ payload }, { call, put, select }) {
      const { data: list } = yield select(({ activities }) => activities);
      const { data } = yield call(update, payload);
      if (data.id) {
        const target = _.find(list, ['id', data.id]);
        if (target) {
          target.status = data.status;
          yield put({
            type: 'upState',
            payload: {
              data: [...list],
            },
          });
        }
      }
    },
  },
  reducers: {
    upState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
