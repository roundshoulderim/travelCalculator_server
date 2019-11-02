module.exports =(sequelize, DataTypes) => {
    return sequelize.define('currencies', {
      iataCode: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: false
      },
      iso : {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: false
      },
      krw : {
        type: DataTypes.FLOAT,
        allowNull: false,
        unique: false
      },
      usd : {
        type : DataTypes.FLOAT,
        allowNull : false,
        unique: false
      }
    }, {
        timestamps: false,
      });
    };
