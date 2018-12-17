import _ from 'lodash';
import uri from 'url';
import router from 'umi/router';

export const jump = (pathname, search, state) => {
  pathname = _.startsWith(pathname, '/') ? pathname : '/' + pathname;
  const path = uri.parse(pathname);
  path.query = search;
  router.push(uri.format(path), state);
};
export const goBack = router.goBack;

export function convertUnit(n) {
  const result = [];
  let data = n / 1024 / 1024;
  let unit = 'M';
  if (data > 1024) {
    data /= 1024;
    unit = 'G';
    if (data > 1024) {
      data /= 1024;
      unit = 'T';
    }
  }
  result[0] = _.round(data, 1);
  result[1] = unit;
  return result;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;

export function isUrl(path) {
  return reg.test(path);
}