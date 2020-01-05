import { get, post, put, del } from '../../../utils/request';

export const getDictDataByName = (type, query) => {
  return get(`v1/api/sys/dict/fetchData/${type}`, query);
};
export const fetch = ({ type, page, pageSize, query }) => {
  return get(`v1/api/sys/dict/${type}/${page}/${pageSize}`, query);
};
export const find = ({ type, query }) => {
  return get(`v1/api/sys/dict/${type}`, query);
};
export const match = ({ type, id }) => {
  return get(`v1/api/sys/dict/get/byId/${type}/${id}`);
};
export const update = (body) => {
  return put(`v1/api/sys/dict`, body);
};
export const add = (body) => {
  return post(`v1/api/sys/dict`, body);
};
export const remove = (id) => {
  return del(`v1/api/sys/dict/${id}`);
};
