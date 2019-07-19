import _ from 'lodash';
import { message } from 'antd';
import { fetch as get, update, remove, create } from '../services/type';
import { fieldsChange } from '../../../utils/ui';

const PAGE_DEF = { page: 1, pageSize: 10 };

export default {
  namespace: 'activityType',
  state: {
    data: [],
    pagination: PAGE_DEF,
    editor: null,
    errors: {},
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/activities/type') {
          dispatch({ type: 'init', payload: { ...PAGE_DEF } });
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
    *fetch({ payload }, { put, call, select }) {
      const { keywords } = yield select(({ activityType }) => activityType);
      const params = { ...PAGE_DEF, ...payload, name: keywords };
      const { data } = yield call(get, params);
      yield put({
        type: 'upState',
        payload: { ...data },
      });
    },
    *edit(p, { call, put, select, all }) {
      const { editor } = yield select(({ activityType }) => activityType);
      let res;
      if (editor.id) {
        res = yield call(update, editor);
      } else {
        res = yield call(create, editor);
      }
      if (res.data) {
        yield all([
          put({
            type: 'fetch',
          }),
          put({
            type: 'upState',
            payload: {
              editor: null,
              errors: {},
            },
          }),
        ]);
      }
    },
    *remove({ id }, { call, put }) {
      const { data } = yield call(remove, id);
      console.log(data);
      if(data) {
        yield put({
          type: 'fetch'
        })
      }
    },
    *changeStatus({ payload }, { call, put, select }) {
      const { data: list } = yield select(({ activityType }) => activityType);
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
    fieldsChange,
  },
};
