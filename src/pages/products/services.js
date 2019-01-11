import { get, post, put, del } from '../../utils/request';

export const addProducts = (data) => {
  return post('v1/api/sys/product', data);
};
export const updateProducts = (data) => {
  return put('v1/api/sys/product', data);
};
export const removeProducts = (id) => {
  return del(`v1/api/sys/product/${id}`);
};
export const getProducts = ({ page = 1, pageSize = 10 } = {}) => {
  return get(`v1/api/sys/product/${page}/${pageSize}`);
};
export const getProduct = (id) => {
  return get('v1/api/sys/product', { id });
};
// 分类
export const getCategories = ({ page = 1, pageSize = 10 } = {}) => {
  return get(`v1/api/sys/productCategary/${page}/${pageSize}`);
};
export const getCate = () => {
  return get(`v1/api/sys/productCategary`);
};
export const addCate = () => {
  return post(`v1/api/sys/productCategary`);
};
export const updateCate = () => {
  return put(`v1/api/sys/productCategary`);
};
