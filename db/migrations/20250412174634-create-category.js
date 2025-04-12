'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('categories', 'title');
    await queryInterface.addColumn('categories', 'title', {
      type:Sequelize.ENUM('FRONTEND', 'BACKEND', 'DATABASE', 'DESING','TOOLS'),
      allowNull:false,
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('categories', 'title');
    await queryInterface.addColumn('categories', 'title', {
      type: Sequelize.STRING(45),
      allowNull: false
    });
  
  }
};
