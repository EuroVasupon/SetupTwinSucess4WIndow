import mysql from 'mysql2';

class DbConnector {
  connection: mysql.Connection;
  constructor(
    host: string,
    userName: string,
    password: string,
    database: string,
    port: number | undefined
  ) {
    const config = {
      host,
      user: userName,
      password,
      database,
      port
    };

    this.connection = mysql.createConnection(config);
  }

  getConnector() {
    return this.connection;
  }

  dbConnect() {
    this.connection.connect();
  }

  dbDisConnect() {
    this.connection.end();
  }

  async getSchema(tableName: string) {
    return new Promise((resolve, reject) => {
      this.connection.query(`DESCRIBE ${tableName}`, function (error, results) {
        if (error) reject(error);
        resolve(results);
      });
    });
  }
}

export default DbConnector;
