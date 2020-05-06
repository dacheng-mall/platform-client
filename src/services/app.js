import { get, post, put } from '../utils/request';

export function login(data) {
  return post('v1/api/login', data);
}
export function logout() {
  return post('v1/api/sys/user/logout');
}
export function changePW(body) {
  return put('v1/api/sys/user/editpwd', body);
}
export function getQiniuToken() {
  return get('v1/api/sys/qiniu/token');
}