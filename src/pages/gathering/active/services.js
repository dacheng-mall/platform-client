import { get, post, put, del } from '../../../utils/request';

export const create = (body) => {
  return post(`v1/api/sys/gathering/main`, body);
};
export const fetch = ({ page, pageSize, query = {} }) => {
  return get(`v1/api/sys/gathering/main/${page}/${pageSize}`, query);
};
export const find = (query) => {
  return get(`v1/api/sys/gathering/main`, query);
};
export const clone = (id) => {
  return post(`v1/api/sys/gathering/main/clone/${id}`);
};
export const remove = (id) => {
  return del(`v1/api/sys/gathering/main/${id}`);
};
export const match = (id, query = {}) => {
  return get(`v1/api/sys/gathering/main/${id}`, {...query, type: 'edit'});
};
export const update = (body) => {
  return put(`v1/api/sys/gathering/main`, body);
};

// 库存设置
export const setStore = ({ id, ...body }) => {
  return post(`v1/api/sys/gathering/store/${id}`, body);
};
export const getStore = (id) => {
  return get(`v1/api/sys/gathering/store/${id}`);
};

export const visitedCSV = (query) => {
  return get(`v1/api/sys/visited/csv/salesman/customer`, query);
};
