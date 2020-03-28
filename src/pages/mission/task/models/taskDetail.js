import _ from 'lodash';
import moment from 'moment';
import ptrx from 'path-to-regexp';
import { message } from 'antd';
import { fieldsChange } from '../../../../utils/ui';
import { upload } from '../../../../utils';
import { match, update, create } from '../services';

const INIT_STATE = {
  editor: {
    source: 'visited',
    type: 'total',
  },
  errors: {},
};
export default {
  namespace: 'taskDetail',
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const pn = ptrx('/mission/task/detail/:id').exec(pathname);
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
      if (id) {
        yield put({
          type: 'fetch',
          id,
        });
      }
    },
    *fetch({ id }, { put, call }) {
      try {
        const { data } = yield call(match, id);
        if (data.id) {
          const { id, ...editor } = data;
          editor.range = [];
          editor.range[0] = moment(editor.from);
          editor.range[1] = moment(editor.to);
          delete editor.from;
          delete editor.to;
          yield put({
            type: 'upState',
            payload: {
              editor,
              id: data.id,
            },
          });
        }
      } catch (error) {}
    },
    *submit(p, { call, select, all }) {
      try {
        const { editor: _editor, id } = yield select(({ taskDetail }) => taskDetail);
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
        // 解析开始和结束时间
        if (editor.range) {
          editor.from = moment(editor.range[0]).format("YYYY-MM-DDT00:00:00");
          editor.to = moment(editor.range[1]).format("YYYY-MM-DDT23:59:59");
          delete editor.range;
        }
        if (!id) {
          try {
            yield call(create, editor);
            message.success('新建成功');
          } catch (error) {}
        } else {
          // 这里执行更新的逻辑
          try {
            yield call(update, { id, ...editor });
            message.success('更新成功');
          } catch (error) {}
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  reducers: {
    upState: (state, { payload }) => {
      return { ...state, ...payload };
    },
    clear: (state) => {
      return { ...state, ...INIT_STATE };
    },
    fieldsChange,
  },
};
