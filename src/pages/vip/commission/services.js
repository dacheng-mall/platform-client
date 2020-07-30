import { get, post, put, del } from '../../../utils/request';

export const create = (data) => {
  return post('v1/api/sys/vip/card', data);
};
export const update = ({id, type}) => {
  return put(`v1/api/sys/vip/commission/${type}/${id}`);
};
export const fetch = ({ page, pageSize, ...query }) => {
  return get(`v1/api/sys/vip/commission/${page}/${pageSize}`, query);
};
export const clone = (id) => {
  return post(`v1/api/sys/vip/card/clone/${id}`);
};
export const remove = (id) => {
  return del(`v1/api/sys/vip/card/${id}`);
};
export const match = (id) => {
  return get(`v1/api/sys/vip/card/${id}`);
};