'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserCustodialWallets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userAddress: {
        unique:true,
        type: Sequelize.STRING
      },
      mnemonic: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      clientTableId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'ClientTables',
          key: 'id'
        },
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
    await queryInterface.dropTable('UserCustodialWallets');
  }
};