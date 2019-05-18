// ref: https://umijs.org/config/
export default {
  ...require('./src/pages'),
  history: 'hash',
  hash: true,
  publicPath: './',
  theme: {"primary-color": "#00b2b3",},
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: true,
        dynamicImport: {
          webpackChunkName: true,
          loadingComponent: '/loading.js',
        },
        title: 'platform-client',
        dll: false,
        routes: {
          exclude: [],
        },
        hardSource: false,
      },
    ],
  ],
};
