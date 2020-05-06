import { get, post, put, del } from '../../../utils/request';

export const getAttestation = ({ page, pageSize, total, pageCount, ...other }) => {
  return get(`v1/api/sys/applyJoin/${page}/${pageSize}`, other);
};
export const excute = (body) => {
  return put('v1/api/sys/applyJoin/excute', body);
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
export const getInstitutionsForInstAdminWhitoutPage = (params) => {
  return get(`v1/api/sys/institution/getAllLevelSonObjsByQuery`, params);
};
