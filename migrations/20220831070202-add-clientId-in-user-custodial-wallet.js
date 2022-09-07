'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('User_Custodial_Wallet', 'clientId',
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'Client',
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
      queryInterface.removeColumn('User_Custodial_Wallet', 'clientId'),
    ]);
  }
};
