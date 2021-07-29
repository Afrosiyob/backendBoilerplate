const { DataTypes } = require("sequelize");
const { sequelize } = require("../../connection/connectPostgres");


// User Model
const User = sequelize.define(
    "User", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
        },
        password: {
            type: DataTypes.STRING,
        },
        role: {
            type: DataTypes.STRING,
            defaultValue: "user",
        },
    }, {
        timestamps: true,
        freezeTableName: true,
    }
);


const Token = sequelize.define(
    "Token", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        tokenId: {
            type: DataTypes.STRING,
        },
    }, {
        timestamps: true,
        freezeTableName: true,
    }
);



// Associations

(async() => {

    // one-to-one => hasOne, belongsTo
    // Model1.hasOne(Model2)
    // Model2.belongsTo(Model1)

    // one-to-many => hasMany, belongsTo
    // Model1.hasMany(Model2)
    // Model2.belongsTo(Model1)

    // many-to-many => hasMany, belongsToMany
    // Model1.belongsToMany(Model2)
    // Model2.belongsToMany(Model1)

    User.hasOne(Token, {
        foreignKey: {
            type: DataTypes.UUID,
            allowNull: false,
        },
    });
    Token.belongsTo(User);



})();


module.exports = {
    User,
    Token
}