const mysql = require("mysql2/promise");
require("dotenv").config();

// Cria uma pool de conexões
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function createDatabaseAndTable(pool) {
  let connection;
  try {
    // Obtém uma conexão da pool
    connection = await pool.getConnection();

    // Cria a base de dados, se não existir
    await connection.query(
      `create database if not exists ${process.env.MYSQL_DB}
      default character set utf8mb3
      default collate utf8mb3_unicode_ci`
    );

    // Seleciona a base de dados criada ou existente
    await connection.query(`use ${process.env.MYSQL_DB}`);

    // Cria a tabela dentro da base de dados
    await connection.query(
      `create table if not exists tasks(
        id int primary key auto_increment,
        titulo varchar(45) not null,
        status varchar(45) not null,
        created_at varchar(45) not null
      )`
    );

    console.log("Base de dados e tabela criadas.");
  } catch (error) {
    console.error("Erro ao criar a base de dados e tabela:", error);
  } finally {
    if (connection) {
      // Libera a conexão de volta para a pool
      connection.release();
    }
  }
}

createDatabaseAndTable(pool);

module.exports = pool;
