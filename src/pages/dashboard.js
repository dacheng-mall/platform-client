module.exports = {
  component: './_layouts',
  routes: [
    require('./overview'),
    ...require('./users'),
    ...require('./products')
  ],
};
