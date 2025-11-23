import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const {
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
  MYSQL_TIMEZONE,
} = process.env;

let pool_vc_bb; // Pool compartido

async function createDatabaseIfNotExists_vc_bb() {
  const conn = await mysql.createConnection({
    host: MYSQL_HOST,
    port: Number(MYSQL_PORT || 3306),
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    timezone: MYSQL_TIMEZONE || 'Z',
    multipleStatements: true,
  });

  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${MYSQL_DATABASE}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
  await conn.end();
}

async function initPool_vc_bb() {
  pool_vc_bb = await mysql.createPool({
    host: MYSQL_HOST,
    port: Number(MYSQL_PORT || 3306),
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    timezone: MYSQL_TIMEZONE || 'Z',
    multipleStatements: true,
  });
}

async function createSchemaAndSeed_vc_bb() {
  const schemaSQL_vc_bb = `
    SET NAMES utf8mb4;
    SET time_zone = '+00:00';

    CREATE TABLE IF NOT EXISTS td_Usuarios_bb_vc (
      ID_usuario_bb_vc INT AUTO_INCREMENT PRIMARY KEY,
      userName_bb_vc VARCHAR(80) NOT NULL UNIQUE,
      nombre_bb_vc VARCHAR(120) NOT NULL,
      apellido_bb_vc VARCHAR(120) NOT NULL,
      correo_bb_vc VARCHAR(200) NOT NULL,
      telefono_bb_vc VARCHAR(50) NOT NULL,
      password_bb_vc VARCHAR(250) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE IF NOT EXISTS td_Rol_bb_vc (
      ID_rol_bb_vc INT AUTO_INCREMENT PRIMARY KEY,
      rol_bb_vc VARCHAR(80) NOT NULL UNIQUE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE IF NOT EXISTS td_UsuarioRol_bb_vc (
      ID_usuarioRol_bb_vc INT AUTO_INCREMENT PRIMARY KEY,
      ID_usuario_usuarioRol_bb_vc INT NOT NULL,
      ID_rol_usuarioRol_bb_vc INT NOT NULL,
      UNIQUE KEY unq_usuario_rol (ID_usuario_usuarioRol_bb_vc, ID_rol_usuarioRol_bb_vc),
      CONSTRAINT fk_usuarioRol_usuario FOREIGN KEY (ID_usuario_usuarioRol_bb_vc)
        REFERENCES td_Usuarios_bb_vc(ID_usuario_bb_vc) ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT fk_usuarioRol_rol FOREIGN KEY (ID_rol_usuarioRol_bb_vc)
        REFERENCES td_Rol_bb_vc(ID_rol_bb_vc) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE IF NOT EXISTS td_Profesores_bb_vc (
      ID_profesor_bb_vc INT AUTO_INCREMENT PRIMARY KEY,
      ID_usuarioRol_profesor_bb_vc INT NOT NULL UNIQUE,
      CONSTRAINT fk_profesor_usuarioRol FOREIGN KEY (ID_usuarioRol_profesor_bb_vc)
        REFERENCES td_UsuarioRol_bb_vc(ID_usuarioRol_bb_vc) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  const seedSQL_vc_bb = `
    INSERT IGNORE INTO td_Rol_bb_vc (rol_bb_vc) VALUES ('Administrador'), ('Profesor');

    INSERT IGNORE INTO td_Usuarios_bb_vc (userName_bb_vc, correo_bb_vc, telefono_bb_vc, nombre_bb_vc, apellido_bb_vc, password_bb_vc)
    VALUES ('admin', 'admin@colegio.com', '0000000000', 'Admin', 'Principal', '123456');

    INSERT IGNORE INTO td_UsuarioRol_bb_vc (ID_usuario_usuarioRol_bb_vc, ID_rol_usuarioRol_bb_vc)
    SELECT u.ID_usuario_bb_vc, r.ID_rol_bb_vc
    FROM td_Usuarios_bb_vc u
    INNER JOIN td_Rol_bb_vc r ON r.rol_bb_vc = 'Administrador'
    WHERE u.userName_bb_vc = 'admin';
  `;

  await pool_vc_bb.query(schemaSQL_vc_bb);
  await pool_vc_bb.query(seedSQL_vc_bb);
}

export async function initDatabase_vc_bb() {
  await createDatabaseIfNotExists_vc_bb();
  await initPool_vc_bb();
  await createSchemaAndSeed_vc_bb();
}

export async function query_vc_bb(sql, params = []) {
  const [rows] = await pool_vc_bb.query(sql, params);
  return rows;
}

export async function getOne_vc_bb(sql, params = []) {
  const [rows] = await pool_vc_bb.query(sql, params);
  return rows && rows.length ? rows[0] : null;
}

export async function execute_vc_bb(sql, params = []) {
  const [result] = await pool_vc_bb.execute(sql, params);
  return result; // { affectedRows, insertId }
}

export default {
  initDatabase_vc_bb,
  query_vc_bb,
  getOne_vc_bb,
  execute_vc_bb,
};

