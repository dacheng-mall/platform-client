// ref: https://umijs.org/config/
export default {
  ...require('./src/pages'),
  history: 'hash',
  publicPath: './',
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: true,
        dynamicImport: true,
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
