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
export const getBatchesWhitoutPage = (parmas) => {
  return get(`v1/api/sys/qrBatch`, parmas);
};
export const getTypesWhitoutPage = (parmas) => {
  return get(`v1/api/sys/qrType`, parmas);
};