/* eslint valid-jsdoc: "off" */

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1749543995094_3375';

  // 文件上传配置
  config.multipart = {
    mode: 'file',
    fileSize: '10mb',
    whitelist: [
      '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp',
      '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
      '.txt', '.zip', '.rar',
    ],
  };

  // add your middleware config here
  config.middleware = [];

  // 安全配置 - 完全禁用CSRF
  config.security = {
    csrf: {
      enable: false,
    },
  };

  // add your user config here
  const userConfig = {
    uploadDir: (env) => {
      const paths = {
        dev: 'app/public/uploads',
        prod: '/root/workspace/website/build/public/uploads'
      };
      return paths[env === 'prod' ? 'prod' : 'dev'];
    }
  };

  return {
    ...config,
    ...userConfig,
  };
};
