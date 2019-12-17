import { get, post, put } from '../../../utils/request';

export const getTemplates = ({ page, pageSize, query }) => {
  return get(`v1/api/sys/logistics/${page}/${pageSize}`, query);
};
export const getTemplate = (id) => {
  return get(`v1/api/sys/logistics/${id}`);
};
export const createTemplate = (body) => {
  return post(`v1/api/sys/logistics`, body);
};
export const updateTemplate = (body) => {
  return put(`v1/api/sys/logistics`, body);
};