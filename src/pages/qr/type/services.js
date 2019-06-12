import { get, put, post } from "../../../utils/request"


export const getTypes = ({ page, pageSize, total, pageCount, ...other }) => {
  return get(`v1/api/sys/qrType/${page}/${pageSize}`, other);
};
export const getTypesWhitoutPage = (parmas) => {
  return get(`v1/api/sys/qrType`, parmas);
};
export const createType = (body) => {
  return post('v1/api/sys/qrType', body);
};
export const updateType = (body) => {
  return put('v1/api/sys/qrType', body);
};