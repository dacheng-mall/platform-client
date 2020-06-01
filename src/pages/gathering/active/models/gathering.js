import _ from 'lodash';
import moment from 'moment';
import { message } from 'antd';
import {
  fetch,
  update,
  exportOrderCSV,
  exportSignCSV,
  exportTicketCSV,
  clone,
  remove,
  getStore,
  setStore,
  fixSign,
  fixOrder,
  fixOrder2,
  fixOrder3,
  syncStore,
  searchInstitutionsByName,
} from '../services';
import { sleep } from '../../../../utils';
// import { get } from '../../../../utils/request';

const PAGE_DEF = { page: 1, pageSize: 6 };

export default {
  namespace: 'gathering',
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/gathering/active' || pathname === '/gathering/active/inst') {
          dispatch({ type: 'init' });
        }
      });
    },
  },
  state: {
    pagination: { ...PAGE_DEF },
    data: [],
    query: {},
    editingStore: null,
  },
  effects: {
    *init(p, { put, select }) {
      const { pagination, data, query } = yield select(({ gathering }) => gathering);
      const user = JSON.parse(sessionStorage.getItem('user'));
      if (user.userType === 3) {
        // 默认查本机构的
        yield put({
          type: 'upState',
          payload: {
            userType: user.userType,
            level: user.institution.level,
            query: {
              institution: {
                key: `${user.institution.id},${user.institution.code}`,
                label: user.institutionName,
              },
              ...query,
            },
          },
        });
        // yield put({
        //   type: 'fetchInst',
        //   payload: { ...pagination },
        // });
        // } else if (user.userType === 1) {
        //   yield put({
        //     type: 'fetch',
        //     payload: { ...pagination },
        //   });
      } else {
        yield put({
          type: 'upState',
          payload: {
            userType: user.userType,
          },
        });
      }
      if (data.length < 1) {
        yield put({
          type: 'fetch',
          payload: { ...pagination },
        });
      }
      // if (data.length < 1) {
      //   const user = JSON.parse(sessionStorage.getItem('user'));
      //   yield put({
      //     type: 'upState',
      //     payload: {
      //       user,
      //     },
      //   });
      // }
    },
    *searchInst({ name }, { call, put }) {
      const { data } = yield call(searchInstitutionsByName, { name });
      yield put({
        type: 'upState',
        payload: {
          inst: _.map(data, ({ name, id, code }) => ({
            key: `${id},${code}`,
            label: name,
          })),
        },
      });
    },
    *fetch({ payload }, { put, call, select }) {
      try {
        const { query, pagination } = yield select(({ gathering }) => gathering);
        const { page, pageSize } = pagination;
        const body = {};
        const { institution, range, enable, name } = query;
        if (institution) {
          [body.pids, body.code] = institution.key.split(',');
        }
        if (range && range.length > 0) {
          const [from, to] = range;
          body.from = from.format('YYYY-MM-DD');
          body.to = to.format('YYYY-MM-DD');
        }
        if (enable && enable !== 'all') {
          switch (enable) {
            case 'true': {
              body.enable = true;
              break;
            }
            case 'false': {
              body.enable = false;
              break;
            }
            default: {
            }
          }
        }
        if (name && _.trim(name)) {
          body.name = name;
        }
        const { data } = yield call(fetch, { page, pageSize, ...payload, query: body });
        yield put({
          type: 'upState',
          payload: {
            ...data,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
    *fetchInst({ payload }, { put, call, select }) {
      try {
        const { query, user } = yield select(({ gathering }) => gathering);
        const { data } = yield call(fetch, {
          ...payload,
          query: {
            ...query,
            getSons: JSON.stringify({
              id: user.institutionId || user.institution.id,
              code: user.institution.code,
            }),
          },
        });
        yield put({
          type: 'upState',
          payload: {
            ...data,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
    *clone({ payload }, { call, put, select }) {
      try {
        yield call(clone, payload.id);
        const { pagination } = yield select(({ gathering }) => gathering);

        yield sleep();
        yield put({
          type: 'fetch',
          payload: { ...pagination },
        });
        message.success('克隆成功');
      } catch (error) {
        message.error(error);
      }
    },
    *store({ id }, { call, put }) {
      try {
        // 先获取, 再设置
        const { data } = yield call(getStore, id);
        yield put({
          type: 'upState',
          payload: {
            editingStore: {
              ...data,
              value: data.current,
            },
          },
        });
      } catch (error) {}
    },
    *changeStore({ value }, { call, put, select }) {
      const { editingStore } = yield select(({ gathering }) => gathering);
      yield put({
        type: 'upState',
        payload: {
          editingStore: {
            ...editingStore,
            value,
          },
        },
      });
    },
    *setStore(p, { call, put, select }) {
      try {
        // 先获取, 再设置
        const { editingStore } = yield select(({ gathering }) => gathering);
        if (!editingStore) {
          message.error('无有效数据可编辑');
          return;
        }
        const { value, id } = editingStore;
        // body.current = value;
        const { data } = yield call(setStore, { current: value, id });
        if (data === 'OK') {
          yield put({
            type: 'upState',
            payload: {
              editingStore: null,
            },
          });
        }
      } catch (error) {}
    },
    *delete({ id }, { call, put, select }) {
      yield call(remove, id);
      const { pagination } = yield select(({ gathering }) => gathering);

      yield sleep();
      yield put({
        type: 'fetch',
        payload: { ...pagination },
      });
      message.success('删除成功');
    },
    *changeEnable({ id, body }, { call, put, select }) {
      const { data: _data } = yield call(update, { id, ...body });
      if (_data.result === 'updated') {
        message.success(`更新成功`);
        const { data } = yield select(({ task }) => task);
        const target = _.find(data, ['id', id]);
        target.enable = body.enable;
        yield put({
          type: 'upState',
          payload: { data: [...data] },
        });
      }
    },
    *exportCSV({ payload }, { call }) {
      switch (payload.type) {
        case 'order': {
          const { data } = yield call(exportOrderCSV, payload);
          if (data && data.url) {
            message.success('导出成功');
            window.location.href = `${window.config.api_prod}${data.url}`;
          } else {
            message.warning(`导出失败-${data}`);
          }
          break;
        }
        case 'sign': {
          const { data } = yield call(exportSignCSV, payload);
          if (data && data.url) {
            message.success('导出成功');
            window.location.href = `${window.config.api_prod}${data.url}`;
          } else {
            message.warning(`导出失败-${data}`);
          }
          break;
        }
        case 'tickets': {
          const { data } = yield call(exportTicketCSV, payload);
          if (data && data.url) {
            message.success('导出成功');
            window.location.href = `${window.config.api_prod}${data.url}`;
          } else {
            message.warning(`导出失败-${data}`);
          }
          break;
        }
      }
    },
    *fixSign({ payload }, { call, put }) {
      const data = yield call(fixSign, payload.id);
    },
    *fixOrder({ payload }, { call, put }) {
      const data = yield call(fixOrder, payload.id);
    },
    *fixOrder2({ payload }, { call, put }) {
      const data = yield call(fixOrder2, payload.id);
    },
    *fixOrder3({ payload }, { call, put }) {
      const data = yield call(fixOrder3, payload.id);
    },
    *syncStore(p, { call, put, select }) {
      const { editingStore } = yield select(({ gathering }) => gathering);
      const data = yield call(syncStore, editingStore.id);
    },
  },
  reducers: {
    upState: (state, { payload }) => {
      return { ...state, ...payload };
    },
  },
};
