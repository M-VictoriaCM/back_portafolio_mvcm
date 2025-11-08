'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('studies', 'type', {
      type: Sequelize.ENUM('universitario', 'bachiller', 'curso'),
      allowNull: false,
      defaultValue: 'curso'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('studies', 'type');
    // Si usaste ENUM, también conviene limpiar el tipo
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_studies_type";');
  }
};
