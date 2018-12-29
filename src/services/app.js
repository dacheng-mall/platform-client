import { get, post } from '../utils/request';

export function login(data) {
  return post('v1/api/login', data);
}
export function getQiniuToken(){
  return get('http://localhost:3000/v1/qiniuToken')
}
