import { get } from '../utils/request';

export function login() {
  return get('api/login');
}
export function getQiniuToken(){
  return get('http://localhost:3000/v1/qiniuToken')
}
