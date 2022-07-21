'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserCustodialWallets extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserCustodialWallets.init({
    userAddress: DataTypes.STRING,
    mnemonic: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'UserCustodialWallets',
  });
  return UserCustodialWallets;
};