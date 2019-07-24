import { get, post, put, del } from '../../../utils/request';

export const createInst = (data) => {
  return post(`v1/api/sys/institution`, data);
};
export const updateInst = (data) => {
  return put(`v1/api/sys/institution`, data);
};
export const getInst = ({ page, pageSize, total, pageCount, ...other }) => {
  return get(`v1/api/sys/institution/${page}/${pageSize}`, other);
};
export const getInstWithoutPage = (query) => {
  return get(`v1/api/sys/institution`, query);
};
export const removeInst = (id) => {
  return del(`v1/api/sys/institution/${id}`);
};
export const createInstQRCode = (params) => {
  return post(`v1/api/wx/createWXAQRCode`, params);
};
export const getInstitutionsWhitoutPage = (params) => {
  return get(`v1/api/sys/institution`, params);
};
export const getInstitutionsForInstAdminWhitoutPage = (params) => {
  return get(`v1/api/sys/institution/getAllLevelSonObjsByQuery`, params);
};
