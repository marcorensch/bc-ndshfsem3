import mariadb from "mariadb";


class DatabaseConnector {
    host;
    port;
    user;
    password;
    database;

    constructor(connectionData) {
        if (!connectionData) {
            this.host = process.env.DB_HOST;
            this.port = process.env.DB_PORT;
            this.user = process.env.DB_USER;
            this.password = process.env.DB_PASSWORD;
            this.database = process.env.NODE_ENV === 'test' ? process.env.TEST_DB_NAME : process.env.DB_NAME;
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
            return {success: true, data: result};
        } catch (err) {
            throw err;
        } finally {
            if (conn) await conn.end();
        }
    }

    async createDatabase(dbName) {
        let conn = await this.createConnection(this.configureConnection(false));
        try {
            const sql = `CREATE DATABASE IF NOT EXISTS ${dbName}`;
            return await conn.query(sql, null);
        } catch (err) {
            throw err;
        } finally {
            if (conn) await conn.end();
        }
    }

    async dropDatabase(dbName) {
        try {
            await this.createConnection(this.configureConnection(false));
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
        console.log("In Set Config:", connectionData);
        this.host = connectionData.host;
        this.port = connectionData.port;
        this.user = connectionData.user;
        this.password = connectionData.password;
        this.database = connectionData.database;
    }
}

export default DatabaseConnector;