import _ from 'lodash';
import moment from 'moment-timezone';
import Sequelize from 'sequelize';
import QueueCreateQuery from './queue-create.js';
import QueueUpsertQuery from './queue-upsert.js';

import SequelizeUniqueConstraintError from 'sequelize/lib/errors/validation/unique-constraint-error.js';

const { Model } = Sequelize;

export default class BaseModel extends Model {
  static init(attributes, options) {
    const model = super.init(attributes, options);

    model.queueCreateQuery = new QueueCreateQuery(model);
    model.queueUpsertQuery = new QueueUpsertQuery(model);

    model.bufferCreate = (data, options = null) => {
      model.queueCreateQuery.queueIn(data, options);
    };

    model.bufferUpsert = (data, options = null) => {
      model.queueUpsertQuery.queueIn(data, options);
    };
    model.bufferBulkCreate = (data, options = null) => {
      model.queueBulkCreateQuery.queueIn(data, options);
    };
    model.bufferBulkChange = (data, options = null) => {
      model.queueBulkChangeQuery.queueIn(data, options);
    };

    model.upsert = async function (data) {
      try {
        data.updated_at = moment().format('YYYY-MM-DD HH:mm:ss');
        console.log('data', data);
        const result = await this.create(data);
        return result;
      } catch (error) {
        switch (true) {
          case error instanceof SequelizeUniqueConstraintError:
            const where = {};
            // error.errors[0].path may(depend on mysql version/configuration?) return table_name.index_name
            // but we only expect index_name
            const path = error.errors[0].path.split('.').pop();
            const uniques = path.split('+');
            try {
              for (const unique of uniques) {
                where[unique] = data[unique];
              }
              return await this.update(data, { where });
            } catch (error) {
              console.log('SequelizeModel.upsert', this.name, error.message);
              // console.log('data', data);
              // console.log('where', where);
              // console.log('uniques', uniques);
              throw error;
            }
          default:
            console.log('ERR.SequelizeModel.upsert', this.name, error.message, error.name);
            throw error;
        }
      }
    };

    return model;
  }
}