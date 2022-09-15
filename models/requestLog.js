'use strict';
const { Sequelize, DataTypes, Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RequestLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // this.belongsTo(models.Client, {
      //   foreignKey: 'clientId'
      // });
    }
  }
  RequestLog.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    ipAddress: {
      type: DataTypes.STRING
    },
    userAddress: {
      type: DataTypes.STRING
    },
    requestMethod: {
      type: DataTypes.STRING
    },
    requestUrl: {
      type: DataTypes.STRING
    },    
    requestBody: {
      type: DataTypes.STRING
    },    
    requestParam: {
      type: DataTypes.STRING
    },
    responseStatusCode: {
      type: DataTypes.STRING
    },
    responseStatusMessage: {
      type: DataTypes.STRING
    },
    responseData: {
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
    modelName: 'Request_Log',
  });
  return RequestLog;
};