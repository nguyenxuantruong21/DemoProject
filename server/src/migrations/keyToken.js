'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('KeyTokens', {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER
      },
      refreshToken: {
        type: Sequelize.TEXT
      },
      refreshTokenUsed: {
        type: Sequelize.TEXT
      },
      user_email: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('KeyTokens')
  }
}
