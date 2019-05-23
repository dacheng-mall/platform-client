import { get, put, del } from '../../../utils/request';

export const getSellers = ({ page, pageSize, total, pageCount, ...other }) => {
  return get(`v1/api/sys/user/${page}/${pageSize}`, { ...other, userType: 4 });
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
export const getInstWithoutPage = (query) => {
  return get(`v1/api/sys/institution`, query);
};
export const findGradesByInsId = (insId) => {
  return get(`v1/api/sys/grade/findGradesByInsId`, { insId });
};
export const exportCSVInstitutionSalesman = (params) => {
  return get(`v1/api/sys/user/salesmenCsv`, params);
}
