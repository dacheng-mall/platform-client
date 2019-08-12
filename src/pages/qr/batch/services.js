import { get, put, post } from '../../../utils/request';
export const getBatches = ({ page, pageSize, total, pageCount, ...other }) => {
  return get(`v1/api/sys/qrBatch/${page}/${pageSize}`, other);
};
export const getBatchesWhitoutPage = (parmas) => {
  return get(`v1/api/sys/qrBatch`, parmas);
};
export const createBatch = (body) => {
  return post('v1/api/sys/qrBatch', body);
};
export const move2OtherBatch = (body) => {
  return put('v1/api/sys/qr/batchInfo', body);
};
export const updateBatch = (body) => {
  return put('v1/api/sys/qrBatch', body);
};
export const getTypesWhitoutPage = (parmas) => {
  return get(`v1/api/sys/qrType`, parmas);
};
export const generate = (parmas) => {
  return post(`v1/api/sys/qrBatch/run`, parmas);
};
export const download = (parmas) => {
  return post(`v1/api/sys/qrBatch/zip`, parmas);
};
export const supply = (parmas) => {
  return post(`v1/api/sys/qrBatch/supply`, parmas);
};
