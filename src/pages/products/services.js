import { get, post } from '../../utils/request';

export const addProducts = (data) => {
  return post('v1/api/sys/product', data)
}
export const getProducts = ({page = 1, pageSize = 10} = {}) => {
  return get(`v1/api/sys/product/${page}/${pageSize}`)
}
export const getProduct = (id) => {
  return get('v1/api/sys/product', {id})
}