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
            this.database = process.env.NODE_ENV = 'test' ? process.env.DB_NAME + '_test' : process.env.DB_NAME;
        } else {
            this.setConfiguration(connectionData);
        }
    }

    async createConnection(config = this.configureConnection(true)) {
        try {
            return mariadb.createConnection(config);
        } catch (err) {
            throw err;
        }
    }

    configureConnection(withDb = false) {
        let config = {
            host: this.host,
            port: this.port,
            user: this.user,
            metaAsArray: false,
            password: this.password,
            // connectionLimit: 10
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
        try {
            await this.createConnection(this.configureConnection(false));
        } catch (err) {
            throw err;
        }
        const sql = `CREATE DATABASE IF NOT EXISTS ${dbName}`;
        return await this.query(sql, null);
    }

    async dropDatabase(dbName) {
        try {
            this.createConnection(this.configureConnection(false));
        } catch (err) {
            throw err;
        }
        const sql = `DROP DATABASE IF EXISTS ${dbName}`;
        return await this.query(sql, null);
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