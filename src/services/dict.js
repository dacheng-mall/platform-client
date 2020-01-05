import { get } from '../utils/request';

export function dictGetElementsTypes() {
  return get('api/getDict/elementTypes');
}
export function getRegionData() {
  return get(`v1/api/sys/dict/region`, { status: '1', dictType: 'region' });
}
