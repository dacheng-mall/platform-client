import { get, post, put, del } from '../../../utils/request';

export const getAdmins = ({ page, pageSize, total, pageCount, ...other }) => {
  return get(`v1/api/sys/user/${page}/${pageSize}`, other);
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
export const getInstWithoutPage = (query) => {
  return get(`v1/api/sys/institution`, query);
};
export const getInstitutionsWhitoutPage = (params) => {
  return get(`v1/api/sys/institution`, params);
};
export const exportCSV = (query) => {
  return get(`v1/api/sys/user/csv/user/by/inst`, query);
};
export const getInstitutionsForInstAdminWhitoutPage = (params) => {
  return get(`v1/api/sys/institution/getAllLevelSonObjsByQuery`, params);
};