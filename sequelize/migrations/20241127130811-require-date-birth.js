'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'dateBirth', {
      type: Sequelize.STRING(10),
      allowNull: false,
      validate: {
        len: [1, 10],
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'dateBirth', {
      type: Sequelize.STRING(11),
      allowNull: true, // Reverte para opcional
      defaultValue: null,
    });
  },
};
