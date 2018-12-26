import mockjs from 'mockjs';

export default {
  'GET /api/getCmsElements': mockjs.mock({
    'list|10': [
      {
        id: '@id()',
        'type|1': ['swiper', 'list'],
        name: '@cword(1,8)',
        'status|0-1': 1,
        count: '@integer(4,12)',
      },
    ],
    page: 0,
    pagesize: 10,
    total: 20,
  }),
  'GET /api/getCmsList': mockjs.mock({
    id: '@id()',
    type: 'list',
    name: '@cword(1,8)',
    'data|5': [
      {
        id: '@id()',
        name: '@cword(3,16)',
        price: '@integer(10,999)',
        mainImage: "@image('64x64', '#333', '#000', '商品')",
        'size|1': [2, 1],
      },
    ],
  }),
  'GET /api/getCmsSwiper': mockjs.mock({
    id: '@id()',
    type: 'swiper',
    name: '@cword(1,8)',
    'data|3': [
      {
        id: '@id()',
        name: '@cword(1,4)',
        path: '/',
        mainImage: "@image('64x64', '#00405d', '#000', 'img')",
      },
    ],
  }),
};
