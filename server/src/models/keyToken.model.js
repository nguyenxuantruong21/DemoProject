'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class KeyToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  KeyToken.init(
    {
      refreshToken: DataTypes.TEXT,
      refreshTokenUsed: DataTypes.TEXT,
      user_email: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'KeyToken'
    }
  )
  return KeyToken
}
