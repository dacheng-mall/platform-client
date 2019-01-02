import { get, post } from '../../utils/request';

export const addProducts = (data) => {
  return post('api/sys/product', data)
}
export const getProducts = (page) => {
  return get('api/products', page)
}
export const getProduct = (id) => {
  return get('api/product', id)
}