/* eslint-disable */
import _ from 'lodash';
import uri from 'url';
import router from 'umi/router';
import * as qiniu from 'qiniu-js';
import { getQiniuToken } from '../services/app';

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

export const icon = (name, size) => {
  if (!name) return;
  if (name.indexOf('fa-') >= 0) {
    return <i className={`fa ${name}`} style={{ fontSize: size || '14px' }} />;
  }
  return <i className={name} style={{ fontSize: size || '22px' }} />;
};
Date.prototype.format = function(fmt) {
  const o = {
    'y+': this.getFullYear(),
    'M+': this.getMonth() + 1, //月份
    'd+': this.getDate(), //日
    'h+': this.getHours(), //小时
    'm+': this.getMinutes(), //分
    's+': this.getSeconds(), //秒
    'q+': Math.floor((this.getMonth() + 3) / 3), //季度
    'S+': this.getMilliseconds(), //毫秒
  };
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      if (k == 'y+') {
        fmt = fmt.replace(RegExp.$1, ('' + o[k]).substr(4 - RegExp.$1.length));
      } else if (k == 'S+') {
        var lens = RegExp.$1.length;
        lens = lens == 1 ? 3 : lens;
        fmt = fmt.replace(RegExp.$1, ('00' + o[k]).substr(('' + o[k]).length - 1, lens));
      } else {
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length),
        );
      }
    }
  }
  return fmt;
};

export const getData = (key) => {
  const res = sessionStorage.getItem(key);
  if (res) {
    return JSON.parse(res);
  }
  return null;
};
export const setData = (key, data) => {
  if (sessionStorage && data !== undefined) {
    let value;
    switch (typeof data) {
      case 'object': {
        if (data !== null) {
          value = JSON.stringify(data);
        }
        break;
      }
      default: {
        value = data;
        break;
      }
    }
    sessionStorage.setItem(key, value);
  }
};
export const qiniuToken = () =>
  new Promise((res, rej) => {
    const { uploadToken, deadline } = getData('qiniu') || {};
    const now = new Date().valueOf();
    let token = uploadToken;
    if (!uploadToken || !deadline || deadline <= now) {
      getQiniuToken()
        .then(({ data }) => {
          if (data) {
            data.deadline = now + data.deadline * 1000;
            setData('qiniu', data);
          }
          token = data.uploadToken;
          res(token);
        })
        .catch((err) => rej(err));
    } else {
      res(token);
    }
  });
export const upload = (file) =>
  async function() {
    const token = await qiniuToken();
    if (file) {
      const keymaker = () => {
        const d = new Date().format('yyyyMMddhhmmss');
        const random = parseInt(Math.random() * 10000, 10);
        return `${d}_${random}__${file.name}`;
      };

      const observable = qiniu.upload(file, keymaker(), token);
      return new Promise((res, rej) => {
        observable.subscribe({
          error: (err) => rej(err),
          complete: (data) => res(data),
        });
      });
    }
  };

export const getQuery = (query = {}) => {
  let _query = '';
  _.forEach(query, (v, k) => {
    _query += `${k}=${v}&`;
  });
  _query.replace(/\&$/, '');
  return `?${_query}`;
};

export const sleep = (time = 1000) => {
  return new Promise((res) => {
    setTimeout(() => {
      res();
    }, time);
  });
};
