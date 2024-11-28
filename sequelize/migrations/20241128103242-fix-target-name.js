'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn(
      'Transactions',
      'accountTargeId',
      'accountTargetId',
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn(
      'Transactions',
      'accountTargetId',
      'accountTargeId',
    );
  },
};
