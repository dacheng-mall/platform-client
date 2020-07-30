import { get, post, put, del } from '../../utils/request';

export const create = (data) => {
  return post('v1/api/sys/mallProducts', data);
};
export const clone = (id) => {
  return post(`v1/api/sys/mallProducts/clone/${id}`);
};
export const remove = (id) => {
  return del(`v1/api/sys/mallProducts/${id}`);
};
export const update = (data) => {
  return put('v1/api/sys/mallProducts', data);
};
export const match = (id) => {
  return get(`v1/api/sys/mallProducts/${id}`);
};
export const syncStore = (id) => {
  return post(`v1/api/sys/mallProducts/syncStore/${id}`);
};
export const fetch = ({ page, pageSize, ...query }) => {
  return get(`v1/api/sys/mallProducts/${page}/${pageSize}`, query);
};
