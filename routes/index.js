import Router from 'koa-router';

import controller from '../controllers/todo-list';

const router = new Router();

router.get(`/`, ctx => ctx.ok('Up and running'));
router.get(`/to-do-list`, controller.fetchList.bind(controller));
router.post(`/to-do-list`, controller.edit.bind(controller));
router.delete(`/to-do-list/:id`, controller.delete.bind(controller));


export default router;
