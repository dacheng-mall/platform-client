import { get, post } from '../../../utils/request';

export const createPrize = (params) => {
  return post(`v1/api/sys/prizes/create`, params);
};
export const updatePrize = (body) => {
  return post(`v1/api/sys/prizes/update`, body);
};
export const getPrize = (id) => {
  return get(`v1/api/sys/prizes/${id}`);
};

export const getPrizes = ({ page, pageSize, query }) => {
  return get(`v1/api/sys/prizes/${page}/${pageSize}`, query);
};
