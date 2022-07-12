'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CustodialWallet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CustodialWallet.init({
    Name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    publicKey: DataTypes.STRING,
    privateKey: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'CustodialWallet',
  });
  return CustodialWallet;
};