'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ClientTable extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ClientTable.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    key: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ClientTable',
  });
  return ClientTable;
};