module.exports =(sequelize, DataTypes) => {
    return sequelize.define('meals', {
      iataCode: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: false,
      },
      onemeal : {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      onedaymeal : {
        type: DataTypes.INTEGER,
        allowNull: false,
      }
    }, {
        timestamps: false,
      });
    };