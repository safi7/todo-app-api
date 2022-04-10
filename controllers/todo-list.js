import _ from 'lodash';

import BaseController from './base';
import todoListM from '../shared/data/todo-list';

export default new (class TestMatchController extends BaseController {
  constructor() {
    super();
  }

  async fetchList(ctx) {
    return this.run(ctx)(async () => {
      const params = ctx.query;
      const { page, per_page } = {page:1, per_page:100, ...params};
      const data = await todoListM.filter(_.omit(params, ['page', 'per_page']), { page, per_page });
      ctx.ok({ data });
    });
  }

  async edit(ctx) {
    return this.run(ctx)(async () => {
      const params = ctx.request.body;
      if(!params.title && !(params.completed && params.item_id )){
        return ctx.send(422, 'params missing');
      }
      await todoListM.edit(_.pick(params, ['item_id','completed', 'title']));
      ctx.ok({ data:'okay' });
    });
  }

  async delete(ctx) {
    return this.run(ctx)(async () => {
      const id = ctx.params.id;
      await todoListM.delete(id);
      ctx.ok({ data:'okay' });
    });
  }

})();
