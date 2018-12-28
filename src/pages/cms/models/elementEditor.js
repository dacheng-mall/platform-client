import ptrx from 'path-to-regexp';
import _ from 'lodash';
import { getCmsList, getCmsSwiper } from '../services';

export default {
  namespace: 'elementEditor',
  state: {},
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const pn = ptrx('/cms/element/:type/:id').exec(pathname);
        if (pn) {
          const typeCode = pn[1];
          const id = pn[2];
          dispatch({
            type: 'init',
            id,
            typeCode,
          });
        }
      });
    },
  },
  effects: {
    *init({ id, typeCode }, { put, call }) {
      let _data;
      if (typeCode === 'list') {
        const { data } = yield call(getCmsList);
        _data = data;
      } else {
        const { data } = yield call(getCmsSwiper);
        _data = data;
      }
      yield put({
        type: 'upState',
        payload: {
          ..._data,
          type: typeCode,
        },
      });
    },
    *change({ payload }, { put, select }) {
      const { value, index, type } = payload;
      let { data } = yield select(({ elementEditor }) => elementEditor);
      switch (type) {
        case 'edit': {
          data[index] = value;
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
        default: {
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
    *getTypes(p, { put, call, select }) {},
  },
  reducers: {
    upState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
