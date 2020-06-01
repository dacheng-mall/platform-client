import { get, post, put, del } from '../../../utils/request';

export const create = (body) => {
  return post(`v1/api/sys/gathering/main`, body);
};
export const fetch = ({ page, pageSize, query = {} }) => {
  console.log('query', query);
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
  return get(`v1/api/sys/gathering/main/${id}`, { ...query, type: 'edit' });
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

export const exportOrderCSV = (query) => {
  return get('v1/api/sys/gathering/orders/exportCSV', query);
};
export const exportSignCSV = (query) => {
  return get('v1/api/sys/gathering/sign/exportCSV', query);
};
export const exportTicketCSV = (query) => {
  return get('v1/api/sys/gathering/tickets/exportCSV', query);
};
export const fixSign = (id) => {
  return post(`v1/api/sys/gathering/signfix/${id}`);
};
export const fixOrder = (id) => {
  return post(`v1/api/sys/gathering/orderfix/${id}`);
};
export const fixOrder2 = (id) => {
  return post(`v1/api/sys/gathering/orderfix2/${id}`);
};
export const fixOrder3 = (id) => {
  return post(`v1/api/sys/gathering/orderfix3/${id}`);
};
export const syncStore = (id) => {
  return put(`v1/api/sys/gathering/store/${id}`);
};
export const exportTicketsCSV = (query) => {
  return get('v1/api/sys/gathering/tickets/exportCSV', query);
};
export const searchInstitutionsByName = (params) => {
  return get(`v1/api/sys/institution/search/by/name`, params);
};
