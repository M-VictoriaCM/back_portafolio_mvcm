"use strict";

/**
 * Migration to change projects.description from STRING(255) to TEXT
 */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('projects', 'description', {
      type: Sequelize.TEXT,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('projects', 'description', {
      type: Sequelize.STRING(255),
      allowNull: false,
    });
  }
};
