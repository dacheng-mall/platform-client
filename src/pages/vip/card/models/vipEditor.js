import _ from 'lodash';
import { message } from 'antd';
import ptrx from 'path-to-regexp';
import { sleep, upload } from '../../../../utils';
import { fieldsChange } from '../../../../utils/ui';
import { fetch, update, create, match, clone } from '../../services';

const INIT_STATE = {
  editor: {},
  errors: {},
};

export default {
  namespace: 'vipEditor',
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const pn = ptrx('/vip/editor/:id').exec(pathname);
        if (pn) {
          dispatch({
            type: 'init',
            id: pn[1],
          });
        } else {
          dispatch({
            type: 'init',
            id: null,
          });
        }
      });
    },
  },
  state: {
    ...INIT_STATE,
  },
  effects: {
    *init({ id }, { put }) {
      yield put({
        type: 'upState',
        payload: {
          ...INIT_STATE,
          id,
        },
      });
      yield put({
        type: 'fetch',
        id,
      });
    },
    *fetch({ id }, { call, put }) {
      if (id) {
        const { data } = yield call(match, id);
        const { id: _id, ...editor } = data;
        yield put({
          type: 'upState',
          payload: { id: _id, editor },
        });
      }
    },
    *changeEnable({ id, body }, { call, put }) {
      const { data: _data } = yield call(update, { id, ...body });
      if (_data.result === 'updated') {
        message.success('更新成功');
        yield sleep(1000);
        yield put({
          type: 'fetch',
        });
      }
    },
    *submit({ payload }, { call, put, select }) {
      const { id } = yield select(({ vipEditor }) => vipEditor);
      if (id) {
        yield call(update, { id, ...payload });
        message.success('更新成功');
      } else {
        const { data: _data } = yield call(create, payload);
        message.success('创建成功');
        if (_data.id) {
          const { id, ...data } = _data;
          yield put({
            type: 'upState',
            payload: { id, editor: data },
          });
        }
      }
    },
    *clone({ id }, { call, put }) {
      const { data: _data } = yield call(clone, id);
      if (_data.id) {
        message.success('克隆成功');
        yield sleep(1000);
        yield put({
          type: 'fetch',
        });
      }
    },
    // *remove({ id }, { call, put }) {
    //   const { data: _data } = yield call(remove, id);
    //   if (_data.result === 'deleted') {
    //     message.success('删除成功');
    //     yield sleep(1000);
    //     yield put({
    //       type: 'fetch',
    //     });
    //   }
    // },
    // *search(p, { put }) {
    //   yield put({
    //     type: 'fetch',
    //     payload: PAGE_DEF,
    //   });
    // },
  },
  reducers: {
    upState: (state, { payload }) => {
      return { ...state, ...payload };
    },
    fieldsChange,
  },
};
