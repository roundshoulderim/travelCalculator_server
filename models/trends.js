module.exports = (sequelize, DataTypes) => {
    return sequelize.define('trends', {
        keyword: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: false,
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        gender: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        iataCode: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false
        },
        count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: false
        },
    }, {
        timestamps: false,
    });
};