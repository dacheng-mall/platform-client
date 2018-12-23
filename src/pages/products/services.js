import { get } from '../../utils/request';

export const getProducts = (page) => {
  return get('api/products', page)
}
export const getProduct = (id) => {
  return get('api/product', id)
}