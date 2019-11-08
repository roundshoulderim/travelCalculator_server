module.exports = (sequelize, DataTypes) => {
    return sequelize.define('userhistories', {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
        },
        departuredate: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        arrivaldate: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false
        },
        estimate: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false
        },
        photo: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false
        }
    }, {
        timestamps: true,
    });
};