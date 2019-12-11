module.exports = (sequelize, DataTypes) => {
  return sequelize.define('apikeys', {
    api: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: false
    },
    key: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: false
    }

  }, {
    timestamps: false,
  });
};
