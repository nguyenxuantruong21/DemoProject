'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class UserRole extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserRole.belongsTo(models.User, { foreignKey: 'user_id', targetKey: 'id', as: 'userData' })
      UserRole.belongsTo(models.Role, { foreignKey: 'role_id', targetKey: 'id', as: 'roleData' })
    }
  }
  UserRole.init(
    {
      user_id: DataTypes.INTEGER,
      role_id: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'UserRole'
    }
  )
  return UserRole
}
