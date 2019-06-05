module.exports = {
  api: 'get /info',
  response: {
    ok: {
      code: 100,
      message: '成功',
      data: {
        name: '小明',
        age: 23,
        status: 10,
      },
    },
  },
};
