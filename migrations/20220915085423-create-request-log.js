'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Request_Log', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ipAddress: {
        type: Sequelize.STRING
      },
      requestMethod: {
        type: Sequelize.STRING
      },
      requestUrl: {
        type: Sequelize.STRING
      },
      requestbody: {
        type: Sequelize.STRING
      },
      requestparam: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Request_Log');
  }
};