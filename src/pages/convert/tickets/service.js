import { get, post } from '../../../utils/request';

export const generateTickets = (body) => {
  return post(`v1/api/sys/elasticSearch/generateTickets`, body);
};

export const getTickets = ({ from = 0, size, query = { match_all: {} } }) => {
  const body = {
    index: 'tickets',
    sort: 'sn:asc',
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
