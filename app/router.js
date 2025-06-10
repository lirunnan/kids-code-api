/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // 文件上传接口
  router.post('/api/files/upload', controller.img.upload);
  router.get('/api/home', controller.home.index);
};
