export default {
  'GET /api/login': (req, res) => {
    res.send({
      id: '1',
      token: '0000',
      name: '张伞',
      username: 'zhangsan',
      roles: ['admin'],
    });
  },
};
