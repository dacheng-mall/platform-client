import { get, post, put, del } from '../../../utils/request';

export const create = (body) => {
  return post(`v1/api/sys/onlineVisitedShare/create`, body);
};
export const fetch = ({ page, pageSize, query = {} }) => {
  return get(`v1/api/sys/onlineVisitedshare/${page}/${pageSize}`, query);
};
export const match = (id) => {
  return get(`v1/api/sys/onlineVisitedShare/match/${id}`);
};
export const update = (body) => {
  return put(`v1/api/sys/onlineVisitedShare/update`, body);
};
export const remove = (id) => {
  return del(`v1/api/sys/onlineVisitedShare/${id}`);
};
export const switchActive = (body) => {
  return put(`v1/api/sys/onlineVisitedShare/switchActive`, body);
};
