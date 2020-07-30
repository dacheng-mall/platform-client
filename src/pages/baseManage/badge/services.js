import { get, post, put } from '../../../utils/request';

export const generate = (body) => {
  return post('v1/api/sys/badge/generate', body);
};
export const fetch = ({ page, pageSize, ...query }) => {
  return get(`v1/api/sys/badge/${page}/${pageSize}`, query);
};
export const update = ({id, ...body}) => {
  return put(`v1/api/sys/badge/${id}`, body);
};
export const batch = (body) => {
  return post(`v1/api/sys/badge/batch`, body);
};

export const exportCSV = (query) => {
  return get('v1/api/sys/badge/csv', query);
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
