import { get, post, put, del } from '../../../utils/request';

export const getAdmins = ({ page, pageSize, total, pageCount, ...other }) => {
  return get(`v1/api/sys/user/${page}/${pageSize}`, { ...other, userType: 3 });
};
export const getAdminsWithoutPage = (query) => {
  return get(`v1/api/sys/user`, query);
};
export const getInstWithoutPage = (query) => {
  return get(`v1/api/sys/institution`, query);
};
export const getAdmin = (id) => {
  return get(`v1/api/sys/user/${id}`);
};
export const createAdmin = (data) => {
  return post('v1/api/sys/user', data);
};
export const updateAdmin = (data) => {
  return put('v1/api/sys/user', data);
};
export const removeAdmin = (id) => {
  return del(`v1/api/sys/user/${id}`);
};
