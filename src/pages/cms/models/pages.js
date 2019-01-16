import _ from 'lodash';
import ptrx from 'path-to-regexp';
import { getCmsElements, updateCmsElement } from '../services';

export default {
  namespace: 'pages',
  state: {
    data: [],
    pagination: {
      page: 1,
      pageSize: 10,
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const pn = ptrx('/cms/pages/:id').exec(pathname);
        if (pn) {
          const id = pn[1];
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
  effects: {
    *init({ id }, { put, call, select }) {
      console.log('id', id)
      // const { pagination } = yield select(({ elements }) => elements);
      // const { data } = yield call(getCmsElements, pagination);
      // yield put({
      //   type: 'upState',
      //   payload: { ...data },
      // });
    },
    *change({ payload }, { put, select }) {
      const { value, index, type } = payload;
      let { data, name, code } = yield select(({ pages }) => pages);
      switch (type) {
        case 'add': {
          data.push(value);
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
          const target = data.splice(index, 1)[0];
          data.splice(position, 0, target);
          break;
        }
        case 'del': {
          data = _.filter(data, (d, i) => i !== index);
          break;
        }
        case 'title': {
          name = value
          break;
        }
        case 'code': {
          code = value
          break;
        }
        default: {
          break;
        }
      }
      yield put({
        type: 'upState',
        payload: {
          elements: [...data],
          name,
          code
        },
      });
    },
    *setStatus({ id, status }, { call, put, select }) {
      const { data: res } = yield call(updateCmsElement, { id, status: status ? 1 : 0 });
      if (res) {
        const { data } = yield select(({ elements }) => elements);
        _.find(data, ['id', res.id]).status = res.status;
        yield put({
          type: 'upState',
          payload: { data: [...data] },
        });
      }
    },
  },
  reducers: {
    upState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
