'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('study_state', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('(UUID())'),
        primaryKey: true,
        allowNull: false,
      },
      state: {
        type: Sequelize.STRING,
        allowNull: false,
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('study_state');
  }
};
