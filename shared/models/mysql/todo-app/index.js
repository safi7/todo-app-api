'use strict';

import config from '../../../../config.js';
import _ from 'lodash';
import moment from 'moment-timezone';
import fs from 'fs-extra';
import path from 'path';
import Sequelize from 'sequelize';

// const basename = import.meta.url.replace('index.js', '');
const basename = path.basename(__filename);
const models = {};
const database = config.mysql_name;

const sequelize = new Sequelize(
  database,
  config.mysql_user,
  config.mysql_pass,
  {
    dialect: 'mysql',
    host: config.mysql_host,
    port: config.mysql_port,
    pool: {
      max: 80,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    timezone: '+00:00',
    logging: false,
    query: { raw: false },
    dialectOptions: {
      dateStrings: true,
      typeCast: true
    },
    define: {
      underscored: true,
      freezeTableName: true,
      hooks: {
        beforeBulkDestroy: function (options) { options.individualHooks = true; },
        beforeBulkUpdate: function (options) { options.individualHooks = true; },
        beforeCreate: function (instance, options) {
          const now = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
          instance.created_at = now;
          instance.updated_at = now;
        },
        beforeUpdate: function (instance, options) {
          instance.updated_at = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
        },
      }
      // hooks: null,
    }
  }
);

// Common JS
fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file)).default.init(sequelize);
    models[model.name] = model;
  });

Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});
models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;