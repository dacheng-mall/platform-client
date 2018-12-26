import { get } from '../utils/request';

export function dictGetElementsTypes() {
  return get('api/getDict/elementTypes');
}
