import { get, post, put } from '../../../utils/request';
export const findInst = (query) => {
  return get(`v1/api/sys/institution`, query);
};
export const findGrade = (institutionId) => {
  return get(`v1/api/sys/grade`, { institutionId });
};
export const findGradesByInsId = (insId) => {
  return get(`v1/api/sys/grade/findGradesByInsId`, { insId });
};
export const createActivity = (data) => {
  return post(`v1/api/sys/activity`, data);
};
export const update = (data) => {
  return put(`v1/api/sys/activity`, data);
};
export const fetch = ({ page, pageSize, total, pageCount, ...other }) => {
  return get(`v1/api/sys/activity/${page}/${pageSize}`, other);
};
export const find = (query) => {
  return get(`v1/api/sys/activity`, query);
};
export const getInstWithoutPage = (query) => {
  return get(`v1/api/sys/institution`, query);
};
export const findTypes = (query) => {
  return get(`v1/api/sys/activityType`, query);
};
