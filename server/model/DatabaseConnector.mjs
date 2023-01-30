import mariadb from "mariadb";
class DatabaseConnector {
    host;
    port;
    user;
    password;
    database;

    constructor(connectionData = false) {
        if (!connectionData) {
            this.host = process.env.DB_HOST;
            this.port = process.env.DB_PORT;
            this.user = process.env.DB_USER;
            this.password = process.env.DB_PASSWORD;
            this.database = process.env.DB_NAME;
        } else {
            this.setConfiguration(connectionData);
        }
    }
    async createConnection(connectionWithDb = true) {
        let config = this.configureConnection(connectionWithDb)
        try {
            return mariadb.createConnection(config);
        } catch (err) {
            console.log("Could not establish database connection")
            console.log(this)
            console.log(err)
        }
    }
    configureConnection(withDb = false) {
        let config = {
            host: this.host,
            port: this.port,
            user: this.user,
            password: this.password,
            metaAsArray: false,
            bigIntAsNumber: true,
            decimalAsNumber: true,
        };
        if (withDb) {
            config.database = this.database;
        }
        return config;
    }
    async query(sql, values) {
        let conn = await this.createConnection();
        try {
            const result = await conn.query(sql, values);
            delete result.meta;
            return {success: true, data: result};
        } catch (err) {
            throw err;
        } finally {
            if (conn) await conn.end();
        }
    }
    async createDatabase(dbName) {
        let conn = await this.createConnection(false);
        try {
            const sql = `CREATE DATABASE IF NOT EXISTS ${dbName} DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci`;
            return await conn.query(sql, null);
        } catch (err) {
            throw err;
        } finally {
            if (conn) await conn.end();
        }
    }
    async dropDatabase(dbName) {
        try {
            await this.createConnection(false);
        } catch (err) {
            throw err;
        }
        const sql = `DROP DATABASE IF EXISTS ${dbName}`;
        try {
            return await this.query(sql, null);
        } catch (err) {
            throw err;
        }
    }
    setConfiguration(connectionData) {
        this.host = connectionData.host;
        this.port = connectionData.port;
        this.user = connectionData.user;
        this.password = connectionData.password;
        this.database = connectionData.database;
    }
}

export default DatabaseConnector;