import mariadb from "mariadb";

let pool = null;

class DatabaseConnector {
    getPool() {
        if (pool == null) {
            this.createPool();
        }
        return pool;
    }

    createPool() {
        pool = mariadb.createPool({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            connectionLimit: 5
        });
    }

    async fetchConnection() {
        this.getPool();
        console.log("Fetching Connection");
        let conn = await pool.getConnection();
        console.log("Total connections: ", pool.totalConnections());
        console.log("Active connections: ", pool.activeConnections());
        console.log("Idle connections: ", pool.idleConnections());
        return conn;
    }

    async query(sql, values) {
        let conn = await this.fetchConnection();
        const result = await conn.query(sql, values);
        console.log(result)
        conn.release();
        return result;
    }
}