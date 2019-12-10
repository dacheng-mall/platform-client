import { get, post } from '../../../utils/request';

export const generateTickets = (body) => {
  return post(`v1/api/sys/tickets/generate`, body);
};
export const exportCSV = (body) => {
  return post(`v1/api/sys/tickets/exportCSV`, body);
};
export const getOrders = ({ page, pageSize, query = {}}) => {
  return get(`v1/api/sys/order/${page}/${pageSize}`, query);
};
