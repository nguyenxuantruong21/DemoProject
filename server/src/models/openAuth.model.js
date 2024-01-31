'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class OpenAuth extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  OpenAuth.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      role_code: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'OpenAuth'
    }
  )
  return OpenAuth
}
