import { get } from '../../utils/request';

export const getCmsElements = (page) => {
  return get('api/getCmsElements', page)
}
export const getCmsList = (id) => {
  return get('api/getCmsList', id)
}
export const getCmsSwiper = (id) => {
  return get('api/getCmsSwiper', id)
}