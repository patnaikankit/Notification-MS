'use strict';

const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('Tickets', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    subject: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    content: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    recepientEmail: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM('PENDING', 'SUCCESS', 'FAILED'),
      defaultValue: 'PENDING',
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  });
};

const down = async (queryInterface, Sequelize) => {
  await queryInterface.dropTable('Tickets');
};

module.exports = {
  up,
  down
};
