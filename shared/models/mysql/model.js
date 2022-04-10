'use strict';
import _ from 'lodash';
import SequelizeModel from 'sequelize/lib/model';
import SequelizeUniqueConstraintError from 'sequelize/lib/errors/validation/unique-constraint-error';
import SequelizeModel from 'sequelize/lib/model';
import moment from 'moment-timezone';

SequelizeModel.upsert = async function (data) {
    try {
          const now = moment().format('YYYY-MM-DD HH:mm:ss');
          data.updated_at = now;
          console.log('data', data);
      await this.create(data);
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
            console.log('SequelizeModel.upsert', error.message);
            throw error;
          }
        default:
          console.log('ERR.SequelizeModel.upsert', this.name, error.message, error.name);
          throw error;
      }
    }
  };
