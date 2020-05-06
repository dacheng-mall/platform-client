import { get, put } from '../../../utils/request';

export const getSellers = ({ page, pageSize, total, pageCount, ...query }) => {
  console.log('========', page, pageSize, query);
  return get(`v1/api/sys/user/by/inst/${page}/${pageSize}`, query);
};
export const getSeller = (id) => {
  return get(`v1/api/sys/user/${id}`);
};
export const updateSeller = (data) => {
  return put('v1/api/sys/user', data);
};
export const removeSeller = (id) => {
  return put('v1/api/sys/user', {
    id,
    institutionId: null,
    gradeId: null,
    gradeName: null,
    userType: 2,
    code: null,
  });
};
export const clearSeller = (id) => {
  return put('v1/api/sys/applyJoin/clearSeller', { id });
};
export const getInstWithoutPage = (query) => {
  return get(`v1/api/sys/institution`, query);
};
export const findGradesByCode = (institutionCode) => {
  return get(`v1/api/sys/grade`, { institutionCode });
};
export const exportCSVInstitutionSalesman = (params) => {
  return get(`v1/api/sys/user/salesmenCsv`, params);
};

export const exportCSV = (query) => {
  return get(`v1/api/sys/user/csv/user/by/inst`, query);
};

export const searchInstitutionsByName = (params) => {
  return get(`v1/api/sys/institution/search/by/name`, params);
};
