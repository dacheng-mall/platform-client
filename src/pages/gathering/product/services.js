import { get, post, put } from '../../../utils/request';

export const fetchProducts = ({ page, pageSize, ...query }) => {
  return get(`v1/api/sys/gathering/product/${page}/${pageSize}`, query);
};
export const findProducts = (query) => {
  return get(`v1/api/sys/gathering/product`, query);
};
export const createProduct = (body) => {
  return post('v1/api/sys/gathering/product', body);
};
export const updateProduct = (body) => {
  return put(`v1/api/sys/gathering/product`, body);
};
export const getProduct = (id) => {
  return get(`v1/api/sys/gathering/product/${id}`);
};
