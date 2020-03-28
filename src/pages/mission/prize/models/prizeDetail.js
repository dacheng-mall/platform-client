import _ from 'lodash';
import ptrx from 'path-to-regexp';
import { message } from "antd";
import { fieldsChange } from '../../../../utils/ui';
import { upload } from '../../../../utils';
import { createPrize, updatePrize, getPrize } from '../services';

const INIT_STATE = {
  editor: {},
  errors: {},
};

export default {
  namespace: 'taskPrizeDetail',
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const pn = ptrx('/mission/prize/detail/:id').exec(pathname);
        let id;
        if (pn) {
          id = pn[1];
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
  state: {
    ...INIT_STATE,
  },
  effects: {
    *init({ id }, { put, call }) {
      if (id) {
        const { data } = yield call(getPrize, id);
        if (data.id === id) {
          const { lastModifyTime, createTime, ...editor } = data;
          yield put({
            type: 'upState',
            payload: { editor, id },
          });
        }
      } else {
        yield put({
          type: 'upState',
          payload: { ...INIT_STATE, id: null },
        });
      }
    },
    *submit(p, { put, call, select, all }) {
      const { editor: _editor, id } = yield select(({ taskPrizeDetail }) => taskPrizeDetail);
      const editor = _.cloneDeep(_editor);
      const todos = {};
      // 处理图片
      _.forEach(editor, (val, key) => {
        switch (key) {
          case 'image': {
            if (val && val.length > 0 && val[0].originFileObj) {
              todos[key] = upload(val[0].originFileObj);
              editor[key] = '';
            }
            break;
          }
        }
      });
      const ups = Object.values(todos);
      const paths = Object.keys(todos);
      if (ups.length > 0) {
        const res = yield all(_.map(ups, (up) => up()));
        _.forEach(paths, (path, i) => {
          _.set(editor, path, res[i].key);
        });
      }
      if (!id) {
        try {
          yield call(createPrize, editor);
          message.success('新建成功');
        } catch (error) {}
      } else {
        // 这里执行更新的逻辑
        try {
          yield call(updatePrize, editor);
          message.success('更新成功');
        } catch (error) {
          
        }
      }
    },
  },
  reducers: {
    upState: (state, { payload }) => {
      return { ...state, ...payload };
    },
    fieldsChange,
  },
};
