'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('studyTypes', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('(UUID())'),
        primaryKey: true,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('studyTypes');
  }
};
