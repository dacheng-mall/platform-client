import { get, post } from '../../../utils/request';

export const findInst = (query) => {
  return get(`v1/api/sys/institution`, query);
};
export const findProducts = (query) => {
  return get(`v1/api/sys/product`, query);
};
export const createPrize = (body) => {
  return post(`v1/api/sys/elasticSearch/createDocument`, { index: 'prizes', body });
};
export const updatePrize = (body, id) => {
  return post(`v1/api/sys/elasticSearch/updateDocument`, {
    index: 'prizes',
    id,
    body: { doc: body },
  });
};
export const getPrize = (id) => {
  return post('v1/api/sys/elasticSearch/get', {
    index: 'prizes',
    id,
  });
};

export const getPrizes = ({ from = 0, size, query = { match_all: {} } }) => {
  const body = {
    index: 'prizes',
    sort: 'createTime:desc',
    from,
    body: {
      query,
    },
  };
  if (size) {
    body.size = size;
  }
  return post(`v1/api/sys/elasticSearch/search`, body);
};
