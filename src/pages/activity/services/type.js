import { get, post, put, del } from '../../../utils/request';

export const fetch = ({ page, pageSize, total, pageCount, ...other }) => {
  return get(`v1/api/sys/activityType/${page}/${pageSize}`);
};
export const remove = (id) => {
  return del(`v1/api/sys/activityType/${id}`);
};
export const create = (params) => {
  return post(`v1/api/sys/activityType`, params);
};
export const update = (params) => {
  if (params.id) {
    return put(`v1/api/sys/activityType`, params);
  }
};
