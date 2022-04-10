import Sequelize from 'sequelize';
import BaseModel from '../base.js';

class BursalArticles extends BaseModel {
  static init(sequelize) {
    const { DataTypes } = Sequelize;
    return super.init(
      {
        id: {
          type: DataTypes.STRING,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4
        },
        item_id: { type: DataTypes.INTEGER, autoIncrement: true },
        title: DataTypes.STRING,
        completed:  { type: DataTypes.INTEGER, default: 0 },
        created_at: DataTypes.STRING,
        updated_at: DataTypes.STRING
      },
      {
        modelName: 'todo_list',
        tableName: 't01_todo_list',
        timestamps: false,
        indexes: [
          { unique: true, fields: ['item_id'], type: 'upsert' }
        ],
        sequelize
      }
    );
  }
}

export default BursalArticles;
