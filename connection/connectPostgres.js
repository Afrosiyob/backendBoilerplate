const { Sequelize } = require( "sequelize" );
const { logger } = require( "../src/logger/logger" );


const sequelize = new Sequelize( "test_postgres", "postgres", "2230102ab", {
    host: "localhost",
    dialect: "postgres",
} );

( async () => {
    try {
        await sequelize.authenticate();
        console.log( "Connection has been established successfully." );
        await sequelize.sync( { alter: true } );
        console.log( "All models were synchronized successfully." );
    } catch ( error ) {
        logger.error( error );
        console.error( "Unable to connect to the database:", error );
        process.exit( 1 );
    }
} )();

module.exports = {
    sequelize,
};