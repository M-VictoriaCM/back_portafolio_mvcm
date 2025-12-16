'use strict';

module.exports = {
  async up (queryInterface) {
    await queryInterface.bulkInsert('studyState', [
      { id: crypto.randomUUID(), state: 'en curso' },
      { id: crypto.randomUUID(), state: 'finalizado' },
      { id: crypto.randomUUID(), state: 'sin terminar' }
    ]);
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('studyState', null, {});
  }
};
