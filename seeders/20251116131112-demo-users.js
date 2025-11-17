'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [{
      email: 'setstroj@rambler.ru',
      password: '$2b$10$q2IVglTrX5HcQA3TinpMVOjQQJRsZqjYVmD3zHGv4dBBXEn0yZDMW', // Не забудьте хешировать!
      name: 'Admin',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { email: 'admin@example.com' }, {});
  }
};
