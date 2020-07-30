import { get, post, put, del } from '../../../utils/request';

export const update = ({id, type}) => {
  return put(`v1/api/sys/vip/orders/${type}/${id}`);
};
export const fetch = ({ page, pageSize, ...query }) => {
  console.log('page, pageSize', page, pageSize)
  return get(`v1/api/sys/vip/orders/${page}/${pageSize}`, query);
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