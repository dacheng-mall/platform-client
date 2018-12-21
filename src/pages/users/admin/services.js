import { get } from '../../../utils/request';

export const getAdmins = (page) => {
  return get('api/admins', page)
}