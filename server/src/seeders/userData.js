'use strict'

const { faker } = require('@faker-js/faker')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let data = []
    let amount = 50
    while (amount--) {
      data.push({
        name: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password()
      })
    }
    await queryInterface.bulkInsert('Users', data, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('User', null, {})
  }
}
