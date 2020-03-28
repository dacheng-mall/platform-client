import { get, post, put } from '../../../utils/request';

export const getPrizes = () => {
  return get(``);
};
export const create = (body) => {
  return post(`v1/api/sys/mission/main`, body);
};
export const fetch = ({ page, pageSize, query = {} }) => {
  return get(`v1/api/sys/mission/main/${page}/${pageSize}`, query);
};
export const find = (query) => {
  return get(`v1/api/sys/mission/main`, query);
};
export const match = (id, query = {}) => {
  return get(`v1/api/sys/mission/main/${id}`, query);
};
export const update = (body) => {
  return put(`v1/api/sys/mission/main`, body);
};
export const visitedCSV = ({ id, ...query }) => {
  return get(`v1/api/sys/mission/csv/result/${id}`, query);
};
export const translate = ({ id }) => {
  return post(`v1/api/sys/mission/result/${id}`);
};
