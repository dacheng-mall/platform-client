import { get, post } from '../../../utils/request';

export const findInst = (query) => {
  return get(`v1/api/sys/institution`, query);
};
export const findProducts = (query) => {
  return get(`v1/api/sys/product`, query);
};
export const createPrize = (params) => {
  return post(`v1/api/sys/prizes/create`, params);
};
export const updatePrize = (body) => {
  return post(`v1/api/sys/prizes/update`, body);
};
export const getPrize = (id) => {
  return get(`v1/api/sys/prizes/${id}`);
};

export const findPrizes = (query) => {
  return get(`v1/api/sys/prizes/findByName`, query);
};
export const getPrizes = ({ page, pageSize, query }) => {
  return get(`v1/api/sys/prizes/${page}/${pageSize}`, query);
};
