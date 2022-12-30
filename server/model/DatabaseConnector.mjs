import mariadb from "mariadb";


class DatabaseConnector {
    host;
    port;
    user;
    password;
    database;
    pool;

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

    getPool() {
        if (this.pool == null) {
            try {
                this.createPool()
            } catch (err) {
                throw err;
            }
        }
    }

    createPool(config = this.configPool(true)) {
        try {
            this.pool = mariadb.createPool(config);
        } catch (err) {
            throw err;
        }
    }

    configPool(withDb = false) {
        let config = {
            host: this.host,
            port: this.port,
            user: this.user,
            password: this.password,
            connectionLimit: 10
        };
        if (withDb) {
            config.database = this.database;
        }
        return config;
    }

    async fetchConnection() {
        this.getPool();
        if (this.pool) {
            try {
                return await this.pool.getConnection();
            } catch (err) {
                throw err;
            }
        } else {
            console.log("Error: No pool available");
            return false;
        }
    }

    async query(sql, values) {
        try {
            let conn = await this.fetchConnection();
            const result = await conn.query(sql, values);
            conn.close();
            delete result.meta;
            return {success: true, data: result};
        } catch (err) {
            throw err;
        }
    }

    async createDatabase(dbName) {
        try {
            this.createPool(this.configPool(false));
        } catch (err) {
            throw err;
        }
        const sql = `CREATE DATABASE IF NOT EXISTS ${dbName}`;
        return await this.query(sql, null);
    }

    async dropDatabase(dbName) {
        try {
            this.createPool(this.configPool(false));
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