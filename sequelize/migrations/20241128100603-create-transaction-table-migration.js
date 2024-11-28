'use strict';

const { DataType } = require('sequelize-typescript');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transactions', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },

      type: {
        type: Sequelize.STRING(70),
        allowNull: false,
      },

      value: {
        type: DataType.INTEGER,
        allowNull: false,
      },

      accountTargeId: {
        type: DataType.STRING(50),
        references: {
          model: 'Accounts',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },

      accountSenderId: {
        type: DataType.STRING(50),
        references: {
          model: 'Accounts',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },

      description: {
        type: DataType.STRING(20),
        allowNull: true,
        defaultValue: null,
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },

      status: {
        type: Sequelize.STRING(15),
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Transactions');
  },
};
