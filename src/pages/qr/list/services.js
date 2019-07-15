import { get, put } from '../../../utils/request';
export const getQrs = ({ page, pageSize, total, pageCount, ...other }) => {
  return get(`v1/api/sys/qr/${page}/${pageSize}`, other);
};
export const getQrsWhitoutPage = (params) => {
  return get(`v1/api/sys/qr`, params);
};
export const updateQr = (params) => {
  return put(`v1/api/sys/qr`, params);
};
export const getBatchesWhitoutPage = (params) => {
  return get(`v1/api/sys/qrBatch`, params);
};
export const getTypesWhitoutPage = (params) => {
  return get(`v1/api/sys/qrType`, params);
};
export const getInstitutionsWhitoutPage = (params) => {
  return get(`v1/api/sys/institution`, params);
};
export const getInstitutionsForInstAdminWhitoutPage = (params) => {
  return get(`v1/api/sys/institution/getAllLevelSonObjsByQuery`, params);
};
export const exportCSV = (params) => {
  return get(`v1/api/sys/qr/exportCsv`, params);
}