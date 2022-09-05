'use strict';
const { Sequelize, DataTypes, Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserCustodialWallets extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.ClientTable, {
        foreignKey: 'clientId'
      });
    }
  }
  UserCustodialWallets.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    userAddress: {
      unique:true,
      type: DataTypes.STRING
    },
    mnemonic: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'UserCustodialWallet',
  });
  return UserCustodialWallets;
};