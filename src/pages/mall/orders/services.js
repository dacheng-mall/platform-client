import { get, post, put, del } from '../../../utils/request';

export const create = (data) => {
  return post('v1/api/sys/mallProducts', data);
};
export const clone = (id) => {
  return post(`v1/api/sys/mallProducts/clone/${id}`);
};
export const remove = (id) => {
  return del(`v1/api/sys/mallProducts/${id}`);
};
export const match = (id) => {
  return get(`v1/api/sys/mallProducts/${id}`);
};
export const update = (data) => {
  return put('v1/api/sys/mallProducts/order', data);
};
export const delivery = (data) => {
  return put('v1/api/sys/mallProducts/order/delivery', data);
};
export const send = (data) => {
  return put('v1/api/sys/mallProducts/order/send', data);
};
export const refunded = (id) => {
  return put(`v1/api/sys/mallProducts/order/refunded/${id}`);
};
export const stockUp = (id) => {
  return put(`v1/api/sys/mallProducts/order/stockUp/${id}`);
};
export const stockUpCancel = (id) => {
  return put(`v1/api/sys/mallProducts/order/stockUpCancel/${id}`);
};
export const fetch = ({ page, pageSize, ...query }) => {
  return get(`v1/api/sys/mallProducts/order/all/${page}/${pageSize}`, query);
};
export const getCompanies = (query) => {
  return get(`v1/api/sys/logistics/companies`, query);
};