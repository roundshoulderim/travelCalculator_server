module.exports =(sequelize, DataTypes) => {
    return sequelize.define('iata', {
      cityKor: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: false,
      },
      cityEng: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      iataCode: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
    }, {
        timestamps: false,
      });
    };