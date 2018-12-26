import mockjs from 'mockjs';

export default {
  'GET /api/getDict/elementTypes': mockjs.mock({
    elementsTypes: [
      {
        id: '@id()',
        code: 'swiper',
        name: '滚图'
      },
      {
        id: '@id()',
        code: 'list',
        name: '商品列表'
      },
    ],
  }),
};
