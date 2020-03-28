import { get, post, put } from '../../../utils/request';

export const fetchPrizes = ({ page, pageSize, ...query }) => {
  return get(`v1/api/sys/mission/prize/${page}/${pageSize}`, query);
};
export const findPrize = (query) => {
  return get(`v1/api/sys/mission/prize`, query);
};
export const createPrize = (body) => {
  return post(`v1/api/sys/mission/prize`, body);
};
export const updatePrize = (body) => {
  return put(`v1/api/sys/mission/prize`, body);
};
export const getPrize = (id) => {
  return get(`v1/api/sys/mission/prize/${id}`);
};
