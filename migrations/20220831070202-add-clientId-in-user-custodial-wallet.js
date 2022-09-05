'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('UserCustodialWallets', 'clientId',
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'ClientTables',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          defaultValue: null, after: 'mnemonic'
        }),
    ]);
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('UserCustodialWallets', 'clientId'),
    ]);
  }
};
