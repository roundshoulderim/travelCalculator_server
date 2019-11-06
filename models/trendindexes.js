module.exports = (sequelize, DataTypes) => {
    return sequelize.define('trendindexes', {
        keywordid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: false,
        },
        keywordkor: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        keywordeng: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        ageid: {
            type: DataTypes.INTEGER,
            allowNull: true,
            unique: false
        },
        age: {
            type: DataTypes.STRING(20),
            allowNull: true,
            unique: false
        },
        genderid: {
            type: DataTypes.INTEGER,
            allowNull: true,
            unique: false
        },
        gender: {
            type: DataTypes.STRING(20),
            allowNull: true,
            unique: false
        }
    }, {
        timestamps: false,
    });
};