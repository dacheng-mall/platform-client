import { get } from '../../../utils/request';

export const getLogisticsTemplate = ({ page, pageSize, query }) => {
  return get(`v1/api/sys/logisticsTemplates/${page}/${pageSize}`, query);
};
