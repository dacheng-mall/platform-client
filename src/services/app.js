import { get } from '../utils/request';

export function login() {
  return get('api/login');
}
