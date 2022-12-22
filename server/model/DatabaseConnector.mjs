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
            console.log("No connection data provided using environment variables");
            this.host = process.env.DB_HOST;
            this.port = process.env.DB_PORT;
            this.user = process.env.DB_USER;
            this.password = process.env.DB_PASSWORD;
            this.database = process.env.DB_NAME;
        } else {
            console.log("Setting connection data from constructor");
            this.setConfiguration(connectionData);
        }

        this.getPool()
    }

    getPool() {
        if (this.pool == null) {
            this.createPool()
        }
    }

    createPool(config = this.configPool(true)) {
        console.log("Creating pool");
        try {
            this.pool = mariadb.createPool(config);
        } catch (err) {
            console.log("Could not create pool", err);
        }
    }

    configPool(withDb = false){
        let config = {
            host: this.host,
            port: this.port,
            user: this.user,
            password: this.password,
            connectionLimit: 5
        };
        if(withDb){
            config.database = this.database;
        }
        return config;
    }
    async fetchConnection() {
        this.getPool();
        if (this.pool) {
            try {
                return await this.pool.getConnection();
            }catch (err) {
                console.log("Could not fetch connection", err);
                return false;
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
            conn.release();
            delete result.meta;
            return {success: true, data: result};
        } catch (err) {
            console.log("Could not query", err);
            return {success: false, data: err};
        }
    }

    async createDatabase(dbName) {
        console.log("Creating database ", dbName);
        this.createPool(this.configPool(false));
        const sql = `CREATE DATABASE IF NOT EXISTS ${dbName}`;
        return await this.query(sql, null);
    }

    async dropDatabase(dbName) {
        this.createPool(this.configPool(false));
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