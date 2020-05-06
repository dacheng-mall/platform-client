import _ from 'lodash';
import moment from 'moment';
import { message } from 'antd';
import ptrx from 'path-to-regexp';
import { create, update, match } from '../services';
import { fieldsChange } from '../../../../utils/ui';
import { upload } from '../../../../utils';

const DEF_FORM = {
  editor: {},
  errors: {},
  id: null,
};

export default {
  namespace: 'onlineVisitedShareDetail',
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const pn = ptrx('/baseManage/onlineVisitedShareDetail/:id').exec(pathname);
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
    ...DEF_FORM,
  },
  effects: {
    *init({ id }, { put, call }) {
      if (id) {
        // 请求目标数据
        const { data } = yield call(match, id);
        if (data) {
          const { id, ...editor } = data;

          yield put({
            type: 'upState',
            payload: {
              editor,
              id,
            },
          });
        }
      } else {
        // 重置表单数据
        yield put({
          type: 'upState',
          payload: {
            ...DEF_FORM,
          },
        });
      }
    },

    *submit(p, { call, select, all }) {
      const { editor: _editor, id } = yield select(
        ({ onlineVisitedShareDetail }) => onlineVisitedShareDetail,
      );
      const editor = _.cloneDeep(_editor);
      const todos = {};
      // 处理图片
      _.forEach(editor, (val, key) => {
        switch (key) {
          case 'image':
          case 'poster': {
            if (val && val.length > 0 && val[0].originFileObj) {
              todos[key] = upload(val[0].originFileObj);
              editor[key] = '';
            }
            break;
          }
        }
      });
      console.log('todos', todos)
      const ups = Object.values(todos);
      const paths = Object.keys(todos);
      if (ups.length > 0) {
        const res = yield all(_.map(ups, (up) => up()));
        _.forEach(paths, (path, i) => {
          _.set(editor, path, res[i].key);
        });
      }
      console.log('editor 提交数据', editor);
      // return
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
    },
    // *changeEnable() {},
    // *getcsvdata({ isActive }, { call, select }) {
    //   const { query } = yield select(({ visited }) => visited);
    //   if (!query.institution) {
    //     message.error('机构信息缺失');
    //     return;
    //   }
    //   if (!query.range) {
    //     message.error('请选择时间段');
    //     return;
    //   }
    //   const body = {};
    //   const { institution, range, type, method } = query;
    //   body.institutionName = institution.label;
    //   [body.pids, body.level] = institution.key.split(',');
    //   [body.from, body.to] = range;
    //   body.from = moment(body.from).format('YYYY-MM-DDT00:00:00');
    //   body.to = moment(body.to).format('YYYY-MM-DDT23:59:59');
    //   if (type && !isActive) {
    //     body.type = type;
    //   }
    //   if (method && !isActive) {
    //     body.type = method;
    //   }
    //   if (isActive) {
    //     body.isActive = true;
    //   } else {
    //     body.isActive = false;
    //   }
    //   const { data } = yield call(findCsvData, body);
    //   if (data && data.url) {
    //     message.success('导出成功');
    //     window.location.href = `${window.config.api_prod}${data.url}`;
    //   } else {
    //     message.warning(`导出失败-${data}`);
    //   }
    // },
  },
  reducers: {
    upState: (state, { payload }) => {
      return { ...state, ...payload };
    },
    fieldsChange,
  },
};
