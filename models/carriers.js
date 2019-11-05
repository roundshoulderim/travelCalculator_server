module.exports = (sequelize, DataTypes) => {
  return sequelize.define('carriers', {
    airline: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: false
    },
    nation: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: false
    },
    iataCode: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: false
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false
    }
  }, {
    timestamps: false,
  });
};