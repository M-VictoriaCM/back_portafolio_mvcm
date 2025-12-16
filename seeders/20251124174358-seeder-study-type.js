'use strict';

module.exports = {
  async up (queryInterface) {
    await queryInterface.bulkInsert('studyTypes', [
      { id: crypto.randomUUID(), type: 'universitario' },
      { id: crypto.randomUUID(), type: 'terciario' },
      { id: crypto.randomUUID(), type: 'bootcamp' },
      { id: crypto.randomUUID(), type: 'curso' },
      { id: crypto.randomUUID(), type: 'capacitación' }
    ]);
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('studyTypes', null, {});
  }
};
