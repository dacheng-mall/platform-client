import { get, post, put, del } from '../../utils/request';

// elements
export const addCmsElement = (data) => {
  return post('v1/api/sys/element', data);
};
export const updateCmsElement = (data) => {
  return put('v1/api/sys/element', data);
};
export const removeCmsElement = (id) => {
  return del(`v1/api/sys/element/${id}`);
};
export const getCmsElementsWithoutPage = (data) => {
  return get('v1/api/sys/element', data);
};
export const getCmsElements = ({ page, pageSize, other }) => {
  return get(`v1/api/sys/element/${page}/${pageSize}`, other);
};

// page
export const addPage = (data) => {
  return post('v1/api/sys/page', data);
};
export const updatePage = (data) => {
  return put('v1/api/sys/page', data);
};
export const removePage = (id) => {
  return del(`v1/api/sys/page/${id}`);
};
export const getPages = (data) => {
  return get('v1/api/sys/page', data);
};
export const getPagesWithPage = ({ page, pageSize, other }) => {
  return get(`v1/api/sys/page/${page}/${pageSize}`, other);
};

// mock
export const getCmsList = (id) => {
  return get('api/getCmsList', id);
};
export const getCmsSwiper = (id) => {
  return get('api/getCmsSwiper', id);
};
