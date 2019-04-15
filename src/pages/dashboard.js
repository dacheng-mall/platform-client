module.exports = {
  component: './_layouts',
  routes: [
    require('./overview'),
    ...require('./institution'),
    ...require('./users'),
    ...require('./products'),
    ...require('./cms'),
  ],
};
