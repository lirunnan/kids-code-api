/* eslint-disable no-empty-function */
/* eslint-disable no-loop-func */
/* eslint-disable no-undef */
'use strict';

const Controller = require('egg').Controller;

class ImageController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = { message: 'hello' };
  }
}
module.exports = ImageController;
