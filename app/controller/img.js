/* eslint-disable no-loop-func */
/* eslint-disable no-undef */
'use strict';

const Controller = require('egg').Controller;
const fs = require('fs');
const path = require('path');

class ImageController extends Controller {
  async upload() {
    const { ctx } = this;
    try {
      // 记录当前环境信息
      ctx.logger.info('当前运行环境:', this.app.config.env);
      // 支持两种上传方式：multipart/form-data和JSON格式
      if (ctx.request.files && ctx.request.files[0]) {
        // 处理multipart/form-data文件上传
        const file = ctx.request.files[0];

        // 文件大小限制 (10MB)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
          ctx.status = 413;
          ctx.body = { success: false, message: '文件大小不能超过10MB' };
          return;
        }

        // 生成文件保存路径(根据环境自动选择)
        const savePath = path.join(this.config.uploadDir(this.app.config.env), file.filename);

        // 确保目录存在
        await fs.promises.mkdir(path.dirname(savePath), { recursive: true });

        // 保存文件
        await fs.promises.rename(file.filepath, savePath);

        ctx.body = {
          success: true,
          message: '文件上传成功',
          filePath: `/public/uploads/${file.filename}`, // URL路径保持不变
        };
      } else if (ctx.request.body && ctx.request.body.filePath) {
        // 处理JSON格式的文件路径上传
        const filePath = ctx.request.body.filePath;
        if (!fs.existsSync(filePath)) {
          ctx.status = 400;
          ctx.body = { success: false, message: '文件不存在' };
          return;
        }

        // 获取文件名
        const filename = path.basename(filePath);
        const savePath = path.join(this.config.uploadDir(this.app.config.env), filename);

        // 复制文件到上传目录
        await fs.promises.copyFile(filePath, savePath);

        ctx.body = {
          success: true,
          message: '文件上传成功',
          url: `/public/uploads/${filename}`, // URL路径保持不变
        };
      } else {
        ctx.status = 400;
        ctx.body = { success: false, message: '请提供有效的文件或文件路径' };
      }
    } catch (err) {
      ctx.logger.error('文件上传失败:', err);
      ctx.status = 500;
      ctx.body = { success: false, message: '文件上传失败' };
    }
  }
  async list() {
    const { ctx } = this;
    try {
      const uploadDir = this.config.uploadDir(this.app.config.env);
      const fullPath = path.isAbsolute(uploadDir) ? 
        uploadDir : 
        path.join(this.app.baseDir, uploadDir);

      // 确保目录存在
      await fs.promises.mkdir(fullPath, { recursive: true });

      // 读取目录下所有文件
      const files = await fs.promises.readdir(fullPath);

      // 过滤掉目录，只返回文件
      const fileList = await Promise.all(
        files.map(async file => {
          const stat = await fs.promises.stat(path.join(fullPath, file));
          return stat.isFile() ? {
            name: file,
            url: `/public/uploads/${file}`,
            size: stat.size,
            mtime: stat.mtime,
          } : null;
        })
      );

      ctx.body = {
        success: true,
        data: fileList.filter(Boolean),
      };
    } catch (err) {
      ctx.logger.error('获取文件列表失败:', err);
      ctx.status = 500;
      ctx.body = { success: false, message: '获取文件列表失败' };
    }
  }
}

module.exports = ImageController;
