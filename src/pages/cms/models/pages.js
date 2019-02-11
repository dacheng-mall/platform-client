import _ from 'lodash';
import ptrx from 'path-to-regexp';
import { message } from 'antd';
import router from 'umi/router'
import { addPage, updatePage, getPages, removePage, getPagesWithoutPage } from '../services';

const DEF_PAGINATION = {
  page: 1,
  pageSize: 10,
};
const DEF_EDITOR = {
  name: '',
  code: '',
  elements: [],
  description: '',
};

export default {
  namespace: 'pages',
  state: {
    data: [],
    pagination: {
      ...DEF_PAGINATION,
    },
    editor: {
      elements: [],
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/cms/pages') {
          // 列表页
          dispatch({
            type: 'init',
            payload: {
              ...DEF_PAGINATION,
            },
          });
        } else if (pathname === '/cms/page') {
          dispatch({
            type: 'editInit',
          });
        } else {
          // 编辑页
          const pn = ptrx('/cms/page/:id').exec(pathname);
          if (pn) {
            const id = pn[1];
            dispatch({
              type: 'editInit',
              id,
            });
          }
        }
      });
    },
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      yield put({
        type: 'fetch',
        payload,
      });
    },
    *fetch({ payload }, { call, put, select }) {
      const { data } = yield call(getPages, payload);
      if (data) {
        yield put({
          type: 'upState',
          payload: { ...data },
        });
      }
    },
    *remove({ id }, { call, select, put }) {
      const { data } = yield select(({ pages }) => pages);
      yield call(removePage, id);
      _.remove(data, (d) => d.id === id);
      yield put({
        type: 'upState',
        payload: {
          data: [...data],
        },
      });
    },
    *editInit({ id }, { put, call, select }) {
      if (id) {
        const { data } = yield call(getPagesWithoutPage, { id });
        yield put({
          type: 'upState',
          payload: {
            editor: data[0],
          },
        });
      } else {
        yield put({
          type: 'upState',
          payload: {
            editor: DEF_EDITOR,
          },
        });
      }
    },
    *change({ payload }, { put, select }) {
      const { value, index, type } = payload;
      let { elements, name, code, description, id } = yield select(({ pages }) => pages.editor);
      switch (type) {
        case 'add': {
          elements.push(value);
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
          const target = elements.splice(index, 1)[0];
          elements.splice(position, 0, target);
          break;
        }
        case 'del': {
          elements = _.filter(elements, (d, i) => i !== index);
          break;
        }
        case 'title': {
          name = value;
          break;
        }
        case 'code': {
          code = value;
          break;
        }
        case 'description': {
          description = value;
          break;
        }
        default: {
          break;
        }
      }
      yield put({
        type: 'upState',
        payload: {
          editor: {
            id,
            elements: [...elements],
            name,
            code,
            description,
          },
        },
      });
    },
    *setStatus({ id, status }, { call, put, select }) {
      const { data: res } = yield call(updatePage, { id, status: status ? 1 : 0 });
      if (res) {
        const { data } = yield select(({ pages }) => pages);
        _.find(data, ['id', res.id]).status = res.status;
        yield put({
          type: 'upState',
          payload: { data: [...data] },
        });
      }
    },
    *submit(p, { call, select, put }) {
      const { elements, name, code, id, description } = yield select(({ pages }) => pages.editor);
      if (elements.length < 1) {
        message.error('暂无可提交内容');
        return;
      }
      if (!name || !code) {
        message.error('名称和code是必填项, code不可重复');
        return;
      }
      const elemKeys = _.map(elements, ({ id }) => id);
      const body = {
        name,
        code,
        description,
        elements: elemKeys,
        count: elemKeys.length,
      };
      if (!id) {
        // add
        body.status = 1;
        const { data } = yield call(addPage, body);
        if (data) {
          message.success('添加页面操作成功');
        }
      } else {
        body.id = id;
        const { data } = yield call(updatePage, body);
        if (data) {
          message.success('更新页面操作成功');
        }
      }
    },
    *goBack(p, {put}){
      yield put({
        type: 'upstate',
        payload: {
          data: [],
          pagination: {
            ...DEF_PAGINATION,
          },
          editor: {
            elements: [],
          },
        }
      })
      router.go(-1)
    }
  },
  reducers: {
    upState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
