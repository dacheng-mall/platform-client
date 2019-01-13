import _ from 'lodash';
import { getCate, addCate, updateCate } from '../services';
import { fieldsChange } from '../../../utils/ui';
import { message } from 'antd';

const getIndex = (list, pid) => _.findIndex(list, function(o) { return o.id === pid; });
const getPath = (list, path) => {
  if(path === '') {
    // todo 如果是根级分类, 还需要处理, 参数可能需要调整
  }
  let _path = '';
  _.forEach(path.split(','), (p, i) => {
    if(i === 0){
      _path = `[${getIndex(list, p)}]`;
    } else {
      console.log('-----', _path);
      _path += `.children[${getIndex(_.get(list, _path).children, p)}]`
    }
  })
  return _path
}

const setList = (list, path, data) => {
  const _path = getPath(list, path);
  _.set(list, `${_path}.children`, data)
}
export default {
  namespace: 'categories',
  state: {
    data: [],
    editor: {},
    errors: {},
    parentCategories: []
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        switch (pathname) {
          case '/products/categories': {
            dispatch({ type: 'init', paylaod: 'categories' });
            break;
          }
          default: {
            break;
          }
        }
      });
    },
  },

  effects: {
    *init(p, { put }) {
      yield put({
        type: 'fetchData',
        pid: '',
        path: ''
      })
    },
    *fetchData({pid, path}, {put, call, select}) {
      const list = yield select(({categories}) => categories.data);
      const _path = path ? `${path},${pid}` : pid;
      const __path = getPath(list, _path);
      const target = _.get(list, `${__path}.children`);
      if(target && target.length > 0) {
        // 已经存在子分类了, 就不再重复请求了
        return;
      }
      const { data } = yield call(getCate, {pid});
      if(data.length > 0) {
        _.forEach(data, (d) => {
          d.children = [];
          d.path = _path;
        });
        if(!pid) {
          list.push(...data);
        } else {
          setList(list, _path, data);
        }
      } else {
        message.warning('暂无子分类');
        setList(list, _path, null)
      };
      yield put({
        type: 'upState',
        payload: {
          data: [...list]
        }
      })
    },
    *edit({payload}, {put}){
      payload.pid = payload.pid || undefined;
      if(payload.pid) {
        yield put({
          type: 'fetchCate',
          payload: { id: payload.pid }
        })
      }
      yield put({
        type: 'upState',
        payload: {
          editor: payload
        }
      })
    },
    *fetchCate({ payload }, { call, put }) {
      console.log()
      const { data } = yield call(getCate, payload);
      if(data.length > 0){
        yield put({
          type: 'upState',
          payload: {
            parentCategories: data
          }
        })
      }
    },
    *submit({ value }, { call, select, put }) {
      const {editor, data: list} = yield select(({categories}) => categories);
      value.status = value.status ? 1 : 0
      value.pid = value.pid || ''
      if (value.id) {
        // 编辑
        const { data } = yield call(updateCate, value);
        let target = _.find(editor.path ? _.get(list, getPath(list, editor.path)).children : list, ['id', value.id]);
        target = {...target, ...data};
        console.log('-----', getPath(list, editor.path))
        // _.set(list, )
        console.log(list)
      } else {
        // 新建
        const { data } = yield call(addCate, value);
      }
      yield put({
        type: 'upState',
        payload: {
          data: [...list]
        }
      })
    },
  },
  reducers: {
    upState(state, { payload }) {
      return { ...state, ...payload };
    },
    fieldsChange,
  },
};
