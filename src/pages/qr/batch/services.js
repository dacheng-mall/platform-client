import { get, put, post } from '../../../utils/request';
export const getBatches = ({ page, pageSize, total, pageCount, ...other }) => {
  return get(`v1/api/sys/qrBatches/${page}/${pageSize}`, other);
};
export const getBatchesWhitoutPage = (parmas) => {
  return get(`v1/api/sys/qrBatches`, parmas);
};
export const createBatch = (body) => {
  return post('v1/api/sys/qrBatch', body);
};
export const updateBatch = (body) => {
  return put('v1/api/sys/qrBatch', body);
};
export const getTypesWhitoutPage = (parmas) => {
  return get(`v1/api/sys/qrType`, parmas);
};
