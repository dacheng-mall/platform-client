import { get, post, put } from '../../../utils/request';

export const getCompanies = ({ page, pageSize, query }) => {
  return get(`v1/api/sys/logistics/companies/${page}/${pageSize}`, query);
};
export const getCompany = (id) => {
  return get(`v1/api/sys/logistics/company/${id}`);
};
export const createCompany = (body) => {
  return post(`v1/api/sys/logistics/company`, body);
};
export const updateCompany = (body) => {
  return put(`v1/api/sys/logistics/company`, body);
};
