let databaseConnect;

var db_atlas =    process.env.DB_ATLAS || false,
    db_username = process.env.DB_USERNAME || null,
    db_password = process.env.DB_PASSWORD || null,
    db_hostname = process.env.DB_HOSTNAME || 'localhost',
    db_port =     process.env.DB_PORT     || 27017,
    db_database = process.env.DB_DATABASE || 'exordium';

if (db_atlas === true) {
    databaseConnect = `mongodb+srv://${db_username}:${db_password}@${db_hostname}/${db_database}?retryWrites=true&w=majority`
} else {
    if (db_username === null & db_password === null) {
        databaseConnect = `mongodb://${db_hostname}:${db_port}/${process.env.DB_DATABASE}`
    } else {
        databaseConnect = `mongodb://${db_username}:${db_password}@${db_hostname}:${db_port}/${db_database}`
    }
}

console.log(`Mongoose Connection: \t${databaseConnect}`);

module.exports = {
    db: databaseConnect
}