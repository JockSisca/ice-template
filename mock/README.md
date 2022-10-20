文件 mock

注意：mock入口在index.ts文件
modules只是区分模块，最后统一在index.ts中引入

然后http.js中会根据index.ts的目录做白名单处理，未在mock中的接口会走原有baseUrl路径

export default {
  // 同时支持 GET 和 POST
  '/api/users/1': { data: {} },
  '/api/foo/bar': { data: {} },

  // 支持标准 HTTP
  'GET /api/users': { users: [1, 2] },
  'DELETE /api/users': { users: [1, 2] },

  // 支持参数
  'POST /api/users/:id': (req, res) => {
    const { id } = req.params;
    res.send({ id: id });
  },
};
