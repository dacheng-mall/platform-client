import { get, post, put } from '../../../utils/request';

export const fetch = ({ page, pageSize, ...query }) => {
  return get(`v1/api/sys/attendance/${page}/${pageSize}`, query);
};
export const attendanceDetailCSV = (query) => {
  return get('v1/api/sys/attendance/csv/detail/data', query);
};
export const findCsvData = (body) => {
  return post(`v1/api/sys/visited/findCsvData`, body);
};
export const getInstitutionsWhitoutPage = (params) => {
  return get(`v1/api/sys/institution`, params);
};
export const searchInstitutionsByName = (params) => {
  return get(`v1/api/sys/institution/search/by/name`, params);
};
export const addPids = () => {
  return post(`v1/api/sys/customers/addpids`);
};
