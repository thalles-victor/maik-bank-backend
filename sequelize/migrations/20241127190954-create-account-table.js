'use strict';

const { DataType } = require('sequelize-typescript');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Accounts', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataType.STRING(70),
        allowNull: false,
        validate: {
          len: [1, 70],
        },
      },
      balance: {
        type: DataType.INTEGER,
        defaultValue: 0,
      },
      status: {
        type: DataType.STRING,
        allowNull: false,
        validate: {
          len: [1, 10],
        },
        defaultValue: 'ACTIVE',
      },
      // relations
      userId: {
        type: Sequelize.STRING,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Accounts');
  },
};
