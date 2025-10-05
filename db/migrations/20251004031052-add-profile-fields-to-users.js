'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "fullName", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("users", "urlAvatar", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("users", "aboutMe", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("users", "socialLinks", {
      type: Sequelize.JSON,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("users", "fullName");
    await queryInterface.removeColumn("users", "urlAvatar");
    await queryInterface.removeColumn("users", "aboutMe");
    await queryInterface.removeColumn("users", "socialLinks");
  },
};
