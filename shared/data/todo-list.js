import _ from 'lodash';
import articledb from '../models/mysql/todo-app';
import Sequalize from 'sequelize';

export default new (class MiscController {
  constructor() { }


  async filter(filters, { page, per_page }) {
    const model = articledb['todo_list'];
    const Op = Sequalize.Op;
    const conditions = [];
    let pipline = {};

    for (let [key, value] of _.entries(filters)) {
      if (!value || value === 'null') { continue; }

      switch (key) {
        case 'search':
          conditions.push({ title: { [Op.like]: `%${value}%` } })
          break;

      }
    }

    if (conditions.length) {
      pipline = { where: { [Op.or]: conditions } }
    }

    const all = await model.findAll(pipline);
    // const data = await model.findAll({
    //   ...pipline,
    //   order: [
    //     ['created_at', 'DESC'],
    //   ], offset: ((+page - 1) * +per_page), limit: +per_page,
    // });
    return all;
  }

  async edit(data) {
    const model = articledb['todo_list'];
    return await model.upsert(data)
  }

  async delete(id) {
    const model = articledb['todo_list'];
    await model.destroy({where: {item_id: +id}})
    return;
  }
})();
