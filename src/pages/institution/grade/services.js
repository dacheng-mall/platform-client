import { get, post, put, del } from '../../../utils/request';

export const create = (data) => {
  return post(`v1/api/sys/grade`, data);
};
export const update = (data) => {
  return put(`v1/api/sys/grade`, data);
};
export const fetch = ({ page, pageSize, total, pageCount, ...other }) => {
  return get(`v1/api/sys/grade/${page}/${pageSize}`, other);
};
export const find = (query) => {
  return get(`v1/api/sys/grade`, query);
};
export const findInst = (query) => {
  return get(`v1/api/sys/institution`, query);
};
export const remove = (id) => {
  return del(`v1/api/sys/grade/${id}`);
};
