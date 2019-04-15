import { get, post, put, del } from '../../../utils/request';

export const getUsers = ({ page, pageSize, total, pageCount, ...other }) => {
  return get(`v1/api/sys/user/${page}/${pageSize}`, other);
};
export const getUser = (id) => {
  return get(`v1/api/sys/user/${id}`);
};
export const removeUser = (id) => {
  return del(`v1/api/sys/user/${id}`);
};
export const updateUser = (id) => {
  return put(`v1/api/sys/user/${id}`);
};
