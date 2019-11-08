module.exports = (sequelize, DataTypes) => {
  return sequelize.define('meals', {
    iataCode: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: false,
    },
    cityName: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: false,
    },
    onemeal: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    onedaymeal: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    iso: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: false
    },
    krw: {
      type: DataTypes.FLOAT,
      allowNull: false,
      unique: false
    },
    usd: {
      type: DataTypes.FLOAT,
      allowNull: false,
      unique: false
    },
    hotel: {
      type: DataTypes.FLOAT,
      allowNull: false,
      unique: false
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false
    }
  }, {
    timestamps: false,
  });
};