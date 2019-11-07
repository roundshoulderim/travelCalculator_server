module.exports = (sequelize, DataTypes) => {
    return sequelize.define('userinfos', {
        username: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: false
        },
        gender: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: false
        },
        keyword: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: false
        }
    }, {
        timestamps: false,
    });
};
