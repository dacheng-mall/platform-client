import { get, post, put } from '../../../utils/request';

export const getPrizes = () => {
  return get(``);
};
export const create = (body) => {
  return post(`v1/api/sys/mission/main`, body);
};
export const fetch = ({ page, pageSize, ...query }) => {
  return get(`v1/api/sys/visited/${page}/${pageSize}`, query);
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

export const visitedCSV = (query) => {
  return get(`v1/api/sys/visited/csv/salesman/customer`, query);
};
export const visitedDetailCSV = (query) => {
  return get(`v1/api/sys/visited/csv/detail/data`, query);
};
export const findCsvData = (body) => {
  return post(`v1/api/sys/visited/findCsvData`, body);
};
export const searchInstitutionsByName = (params) => {
  return get(`v1/api/sys/institution/search/by/name`, params);
};
export const addPids = () => {
  return post(`v1/api/sys/customers/addpids`);
};
export const transfer = () => {
  return post(`v1/api/sys/visited/transfer`);
};
