let databaseConnect;

var db_username = process.env.DB_USERNAME || null,
    db_password = process.env.DB_PASSWORD || null,
    db_hostname = process.env.DB_HOSTNAME || 'localhost',
    db_port = process.env.DB_PORT || 80,
    db_database = process.env.DB_DATABASE || 'exordium';

if (db_username === null & db_password === null) {
    databaseConnect = `mongodb://${db_hostname}:${db_port}/${process.env.DB_DATABASE}`
} else {
    databaseConnect = `mongodb://${db_username}:${db_password}@${db_hostname}:${db_port}/${db_database}`
}

console.log(`Mongoose Connect: \t${databaseConnect}`);

module.exports = {
    db: databaseConnect
}