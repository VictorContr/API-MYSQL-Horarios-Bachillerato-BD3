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

    CREATE TABLE IF NOT EXISTS td_Administradores_bb_vc (
      ID_administradores_bb_vc INT AUTO_INCREMENT PRIMARY KEY,
      ID_usuarioRol_admin_bb_vc INT,
      CONSTRAINT fk_admin_usuarioRol FOREIGN KEY (ID_usuarioRol_admin_bb_vc)
        REFERENCES td_UsuarioRol_bb_vc(ID_usuarioRol_bb_vc) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE IF NOT EXISTS td_Profesores_bb_vc (
      ID_profesor_bb_vc INT AUTO_INCREMENT PRIMARY KEY,
      ID_usuarioRol_profesor_bb_vc INT NOT NULL UNIQUE,
      CONSTRAINT fk_profesor_usuarioRol FOREIGN KEY (ID_usuarioRol_profesor_bb_vc)
        REFERENCES td_UsuarioRol_bb_vc(ID_usuarioRol_bb_vc) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE IF NOT EXISTS td_Bloque_bb_vc (
      ID_bloque_bb_vc INT AUTO_INCREMENT PRIMARY KEY,
      hora_bloque_bb_vc VARCHAR(20) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE IF NOT EXISTS td_Dia_bb_vc (
      ID_dia_bb_vc INT AUTO_INCREMENT PRIMARY KEY,
      dia_bb_vc VARCHAR(20) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE IF NOT EXISTS td_TipoEspacio_bb_vc (
      ID_TipoEspacio_bb_vc INT AUTO_INCREMENT PRIMARY KEY,
      tipo_bb_vc VARCHAR(100)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE IF NOT EXISTS td_Espacios_bb_vc (
      ID_espacio_bb_vc INT AUTO_INCREMENT PRIMARY KEY,
      nombre_bb_vc VARCHAR(200),
      capacidad_bb_vc INT,
      ID_TipoEspacio_espacio_bb_vc INT,
      CONSTRAINT fk_espacio_tipo FOREIGN KEY (ID_TipoEspacio_espacio_bb_vc)
        REFERENCES td_TipoEspacio_bb_vc(ID_TipoEspacio_bb_vc) ON DELETE SET NULL ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE IF NOT EXISTS td_Grados_bb_vc (
      ID_grado_bb_vc INT AUTO_INCREMENT PRIMARY KEY,
      nro_grado_bb_vc INT NOT NULL,
      UNIQUE KEY unq_grado_nro (nro_grado_bb_vc)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE IF NOT EXISTS td_Secciones_bb_vc (
      ID_seccion_bb_vc INT AUTO_INCREMENT PRIMARY KEY,
      letra_seccion_bb_vc VARCHAR(10) NOT NULL,
      UNIQUE KEY unq_seccion_letra (letra_seccion_bb_vc)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE IF NOT EXISTS td_Clases_bb_vc (
      ID_clase_bb_vc INT AUTO_INCREMENT PRIMARY KEY,
      ID_grado_clase_bb_vc INT NOT NULL,
      ID_seccion_clase_bb_vc INT NOT NULL,
      UNIQUE KEY unq_clase_grado_seccion (ID_grado_clase_bb_vc, ID_seccion_clase_bb_vc),
      CONSTRAINT fk_clase_grado FOREIGN KEY (ID_grado_clase_bb_vc)
        REFERENCES td_Grados_bb_vc(ID_grado_bb_vc) ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT fk_clase_seccion FOREIGN KEY (ID_seccion_clase_bb_vc)
        REFERENCES td_Secciones_bb_vc(ID_seccion_bb_vc) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE IF NOT EXISTS td_Asignaturas_bb_vc (
      ID_asignatura_bb_vc INT AUTO_INCREMENT PRIMARY KEY,
      nombre_bb_vc VARCHAR(200) NOT NULL,
      horas_academicas_bb_vc INT,
      descripcion_bb_vc TEXT,
      duracion_bloque_min_bb_vc INT DEFAULT 1,
      duracion_bloque_max_bb_vc INT DEFAULT 1,
      ID_TipoEspacio_requerido_bb_vc INT NULL,
      CONSTRAINT fk_asignatura_tipoEspacio FOREIGN KEY (ID_TipoEspacio_requerido_bb_vc)
        REFERENCES td_TipoEspacio_bb_vc(ID_TipoEspacio_bb_vc) ON DELETE SET NULL ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE IF NOT EXISTS td_GradosAsignaturas_bb_vc (
      ID_gradoAsignatura_bb_vc INT AUTO_INCREMENT PRIMARY KEY,
      ID_grado_gradoAsig_bb_vc INT,
      ID_asignatura_gradoAsig_bb_vc INT,
      CONSTRAINT fk_gradoAsig_grado FOREIGN KEY (ID_grado_gradoAsig_bb_vc)
        REFERENCES td_Grados_bb_vc(ID_grado_bb_vc) ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT fk_gradoAsig_asignatura FOREIGN KEY (ID_asignatura_gradoAsig_bb_vc)
        REFERENCES td_Asignaturas_bb_vc(ID_asignatura_bb_vc) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE IF NOT EXISTS td_ProfesorAsignaturas_bb_vc (
      ID_profesorAsig_bb_vc INT AUTO_INCREMENT PRIMARY KEY,
      ID_profesor_profAsig_bb_vc INT,
      ID_asignatura_profAsig_bb_vc INT,
      CONSTRAINT fk_profAsig_profesor FOREIGN KEY (ID_profesor_profAsig_bb_vc)
        REFERENCES td_Profesores_bb_vc(ID_profesor_bb_vc) ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT fk_profAsig_asignatura FOREIGN KEY (ID_asignatura_profAsig_bb_vc)
        REFERENCES td_Asignaturas_bb_vc(ID_asignatura_bb_vc) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE IF NOT EXISTS td_DisponibilidadProfesor_bb_vc (
      ID_DisponibilidadProfesor_bb_vc INT AUTO_INCREMENT PRIMARY KEY,
      ID_dia_DispProfesor_bb_vc INT,
      ID_bloque_DispProfesor_bb_vc INT,
      ID_profesor_DispProfesor_bb_vc INT,
      CONSTRAINT fk_dispProf_dia FOREIGN KEY (ID_dia_DispProfesor_bb_vc)
        REFERENCES td_Dia_bb_vc(ID_dia_bb_vc) ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT fk_dispProf_bloque FOREIGN KEY (ID_bloque_DispProfesor_bb_vc)
        REFERENCES td_Bloque_bb_vc(ID_bloque_bb_vc) ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT fk_dispProf_profesor FOREIGN KEY (ID_profesor_DispProfesor_bb_vc)
        REFERENCES td_Profesores_bb_vc(ID_profesor_bb_vc) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE IF NOT EXISTS td_DisponibilidadEspacio_bb_vc (
      ID_DisponibilidadEspacio_bb_vc INT AUTO_INCREMENT PRIMARY KEY,
      ID_dia_DispEspacio_bb_vc INT,
      ID_bloque_DispEspacio_bb_vc INT,
      ID_espacio_DispEspacio_bb_vc INT,
      CONSTRAINT fk_dispEsp_dia FOREIGN KEY (ID_dia_DispEspacio_bb_vc)
        REFERENCES td_Dia_bb_vc(ID_dia_bb_vc) ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT fk_dispEsp_bloque FOREIGN KEY (ID_bloque_DispEspacio_bb_vc)
        REFERENCES td_Bloque_bb_vc(ID_bloque_bb_vc) ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT fk_dispEsp_espacio FOREIGN KEY (ID_espacio_DispEspacio_bb_vc)
        REFERENCES td_Espacios_bb_vc(ID_espacio_bb_vc) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE IF NOT EXISTS td_Horario_bb_vc (
      ID_Horario_bb_vc INT AUTO_INCREMENT PRIMARY KEY,
      ID_dia_horario_bb_vc INT,
      ID_bloque_horario_bb_vc INT,
      ID_asignatura_horario_bb_vc INT,
      ID_espacio_horario_bb_vc INT,
      ID_profesor_horario_bb_vc INT,
      ID_grado_horario_bb_vc INT,
      ID_seccion_horario_bb_vc INT,
      CONSTRAINT fk_horario_dia FOREIGN KEY (ID_dia_horario_bb_vc)
        REFERENCES td_Dia_bb_vc(ID_dia_bb_vc) ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT fk_horario_bloque FOREIGN KEY (ID_bloque_horario_bb_vc)
        REFERENCES td_Bloque_bb_vc(ID_bloque_bb_vc) ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT fk_horario_asignatura FOREIGN KEY (ID_asignatura_horario_bb_vc)
        REFERENCES td_Asignaturas_bb_vc(ID_asignatura_bb_vc) ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT fk_horario_espacio FOREIGN KEY (ID_espacio_horario_bb_vc)
        REFERENCES td_Espacios_bb_vc(ID_espacio_bb_vc) ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT fk_horario_profesor FOREIGN KEY (ID_profesor_horario_bb_vc)
        REFERENCES td_Profesores_bb_vc(ID_profesor_bb_vc) ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT fk_horario_grado FOREIGN KEY (ID_grado_horario_bb_vc)
        REFERENCES td_Grados_bb_vc(ID_grado_bb_vc) ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT fk_horario_seccion FOREIGN KEY (ID_seccion_horario_bb_vc)
        REFERENCES td_Secciones_bb_vc(ID_seccion_bb_vc) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  const seedSQL_vc_bb = `
    INSERT INTO td_Rol_bb_vc (rol_bb_vc)
      SELECT 'Administrador' WHERE NOT EXISTS (SELECT 1 FROM td_Rol_bb_vc WHERE rol_bb_vc = 'Administrador');
    INSERT INTO td_Rol_bb_vc (rol_bb_vc)
      SELECT 'Profesor' WHERE NOT EXISTS (SELECT 1 FROM td_Rol_bb_vc WHERE rol_bb_vc = 'Profesor');

    INSERT INTO td_Usuarios_bb_vc (userName_bb_vc, correo_bb_vc, telefono_bb_vc, nombre_bb_vc, apellido_bb_vc, password_bb_vc)
      SELECT 'admin', 'admin@colegio.com', '0000000000', 'Admin', 'Principal', '123456'
      WHERE NOT EXISTS (SELECT 1 FROM td_Usuarios_bb_vc WHERE userName_bb_vc = 'admin');

    INSERT INTO td_UsuarioRol_bb_vc (ID_usuario_usuarioRol_bb_vc, ID_rol_usuarioRol_bb_vc)
      SELECT u.ID_usuario_bb_vc, r.ID_rol_bb_vc
      FROM td_Usuarios_bb_vc u JOIN td_Rol_bb_vc r ON r.rol_bb_vc = 'Administrador'
      WHERE u.userName_bb_vc = 'admin'
        AND NOT EXISTS (
          SELECT 1 FROM td_UsuarioRol_bb_vc ur
          WHERE ur.ID_usuario_usuarioRol_bb_vc = u.ID_usuario_bb_vc AND ur.ID_rol_usuarioRol_bb_vc = r.ID_rol_bb_vc
        );

    INSERT INTO td_Dia_bb_vc (dia_bb_vc) SELECT 'lunes' WHERE NOT EXISTS (SELECT 1 FROM td_Dia_bb_vc WHERE dia_bb_vc = 'lunes');
    INSERT INTO td_Dia_bb_vc (dia_bb_vc) SELECT 'martes' WHERE NOT EXISTS (SELECT 1 FROM td_Dia_bb_vc WHERE dia_bb_vc = 'martes');
    INSERT INTO td_Dia_bb_vc (dia_bb_vc) SELECT 'miércoles' WHERE NOT EXISTS (SELECT 1 FROM td_Dia_bb_vc WHERE dia_bb_vc = 'miércoles');
    INSERT INTO td_Dia_bb_vc (dia_bb_vc) SELECT 'jueves' WHERE NOT EXISTS (SELECT 1 FROM td_Dia_bb_vc WHERE dia_bb_vc = 'jueves');
    INSERT INTO td_Dia_bb_vc (dia_bb_vc) SELECT 'viernes' WHERE NOT EXISTS (SELECT 1 FROM td_Dia_bb_vc WHERE dia_bb_vc = 'viernes');

    INSERT INTO td_Bloque_bb_vc (hora_bloque_bb_vc) SELECT '7:00 am' WHERE NOT EXISTS (SELECT 1 FROM td_Bloque_bb_vc WHERE hora_bloque_bb_vc = '7:00 am');
    INSERT INTO td_Bloque_bb_vc (hora_bloque_bb_vc) SELECT '8:00 am' WHERE NOT EXISTS (SELECT 1 FROM td_Bloque_bb_vc WHERE hora_bloque_bb_vc = '8:00 am');
    INSERT INTO td_Bloque_bb_vc (hora_bloque_bb_vc) SELECT '9:00 am' WHERE NOT EXISTS (SELECT 1 FROM td_Bloque_bb_vc WHERE hora_bloque_bb_vc = '9:00 am');
    INSERT INTO td_Bloque_bb_vc (hora_bloque_bb_vc) SELECT '10:00 am' WHERE NOT EXISTS (SELECT 1 FROM td_Bloque_bb_vc WHERE hora_bloque_bb_vc = '10:00 am');
    INSERT INTO td_Bloque_bb_vc (hora_bloque_bb_vc) SELECT '11:00 am' WHERE NOT EXISTS (SELECT 1 FROM td_Bloque_bb_vc WHERE hora_bloque_bb_vc = '11:00 am');
    INSERT INTO td_Bloque_bb_vc (hora_bloque_bb_vc) SELECT '12:00 pm' WHERE NOT EXISTS (SELECT 1 FROM td_Bloque_bb_vc WHERE hora_bloque_bb_vc = '12:00 pm');
    INSERT INTO td_Bloque_bb_vc (hora_bloque_bb_vc) SELECT '1:00 pm' WHERE NOT EXISTS (SELECT 1 FROM td_Bloque_bb_vc WHERE hora_bloque_bb_vc = '1:00 pm');
    INSERT INTO td_Bloque_bb_vc (hora_bloque_bb_vc) SELECT '2:00 pm' WHERE NOT EXISTS (SELECT 1 FROM td_Bloque_bb_vc WHERE hora_bloque_bb_vc = '2:00 pm');
    INSERT INTO td_Bloque_bb_vc (hora_bloque_bb_vc) SELECT '3:00 pm' WHERE NOT EXISTS (SELECT 1 FROM td_Bloque_bb_vc WHERE hora_bloque_bb_vc = '3:00 pm');
    INSERT INTO td_Bloque_bb_vc (hora_bloque_bb_vc) SELECT '4:00 pm' WHERE NOT EXISTS (SELECT 1 FROM td_Bloque_bb_vc WHERE hora_bloque_bb_vc = '4:00 pm');

    INSERT INTO td_TipoEspacio_bb_vc (tipo_bb_vc) SELECT 'Aula Genérica' WHERE NOT EXISTS (SELECT 1 FROM td_TipoEspacio_bb_vc WHERE tipo_bb_vc = 'Aula Genérica');
    INSERT INTO td_TipoEspacio_bb_vc (tipo_bb_vc) SELECT 'Espacio Especializado' WHERE NOT EXISTS (SELECT 1 FROM td_TipoEspacio_bb_vc WHERE tipo_bb_vc = 'Espacio Especializado');

    INSERT INTO td_Usuarios_bb_vc (userName_bb_vc, correo_bb_vc, telefono_bb_vc, nombre_bb_vc, apellido_bb_vc, password_bb_vc)
      SELECT 'ana.gomez', 'ana.gomez@mail.com', '1111111', 'Ana', 'Gómez', '123456'
      WHERE NOT EXISTS (SELECT 1 FROM td_Usuarios_bb_vc WHERE userName_bb_vc = 'ana.gomez');

    INSERT INTO td_UsuarioRol_bb_vc (ID_usuario_usuarioRol_bb_vc, ID_rol_usuarioRol_bb_vc)
      SELECT u.ID_usuario_bb_vc, r.ID_rol_bb_vc FROM td_Usuarios_bb_vc u JOIN td_Rol_bb_vc r ON r.rol_bb_vc = 'Profesor'
      WHERE u.userName_bb_vc = 'ana.gomez'
        AND NOT EXISTS (
          SELECT 1 FROM td_UsuarioRol_bb_vc ur WHERE ur.ID_usuario_usuarioRol_bb_vc = u.ID_usuario_bb_vc AND ur.ID_rol_usuarioRol_bb_vc = r.ID_rol_bb_vc
        );
    INSERT INTO td_UsuarioRol_bb_vc (ID_usuario_usuarioRol_bb_vc, ID_rol_usuarioRol_bb_vc)
      SELECT u.ID_usuario_bb_vc, r.ID_rol_bb_vc FROM td_Usuarios_bb_vc u JOIN td_Rol_bb_vc r ON r.rol_bb_vc = 'Profesor'
      WHERE u.userName_bb_vc = 'luis.perez'
        AND NOT EXISTS (
          SELECT 1 FROM td_UsuarioRol_bb_vc ur WHERE ur.ID_usuario_usuarioRol_bb_vc = u.ID_usuario_bb_vc AND ur.ID_rol_usuarioRol_bb_vc = r.ID_rol_bb_vc
        );

    INSERT INTO td_Administradores_bb_vc (ID_usuarioRol_admin_bb_vc)
      SELECT ur.ID_usuarioRol_bb_vc FROM td_UsuarioRol_bb_vc ur JOIN td_Rol_bb_vc r ON r.ID_rol_bb_vc = ur.ID_rol_usuarioRol_bb_vc JOIN td_Usuarios_bb_vc u ON u.ID_usuario_bb_vc = ur.ID_usuario_usuarioRol_bb_vc
      WHERE r.rol_bb_vc = 'Administrador' AND u.userName_bb_vc = 'admin'
        AND NOT EXISTS (
          SELECT 1 FROM td_Administradores_bb_vc a WHERE a.ID_usuarioRol_admin_bb_vc = ur.ID_usuarioRol_bb_vc
        );

    INSERT INTO td_Profesores_bb_vc (ID_usuarioRol_profesor_bb_vc)
      SELECT ur.ID_usuarioRol_bb_vc FROM td_UsuarioRol_bb_vc ur JOIN td_Usuarios_bb_vc u ON u.ID_usuario_bb_vc = ur.ID_usuario_usuarioRol_bb_vc JOIN td_Rol_bb_vc r ON r.ID_rol_bb_vc = ur.ID_rol_usuarioRol_bb_vc
      WHERE r.rol_bb_vc = 'Profesor' AND u.userName_bb_vc = 'ana.gomez'
        AND NOT EXISTS (
          SELECT 1 FROM td_Profesores_bb_vc p WHERE p.ID_usuarioRol_profesor_bb_vc = ur.ID_usuarioRol_bb_vc
        );
  `;

  const routinesSQL_vc_bb = `
    DROP FUNCTION IF EXISTS fn_normalize_text_bb_vc;
    CREATE FUNCTION fn_normalize_text_bb_vc(s VARCHAR(255)) RETURNS VARCHAR(255)
    DETERMINISTIC
    RETURN UPPER(TRIM(s));

    DROP PROCEDURE IF EXISTS sp_upsert_grado_bb_vc;
    CREATE PROCEDURE sp_upsert_grado_bb_vc(IN p_nro INT)
    BEGIN
      IF p_nro IS NOT NULL THEN
        INSERT INTO td_Grados_bb_vc (nro_grado_bb_vc)
        VALUES (p_nro)
        ON DUPLICATE KEY UPDATE nro_grado_bb_vc = VALUES(nro_grado_bb_vc);
      END IF;
    END;

    DROP PROCEDURE IF EXISTS sp_upsert_seccion_bb_vc;
    CREATE PROCEDURE sp_upsert_seccion_bb_vc(IN p_letra VARCHAR(10))
    BEGIN
      SET p_letra = fn_normalize_text_bb_vc(p_letra);
      IF p_letra IS NOT NULL AND p_letra <> '' THEN
        INSERT INTO td_Secciones_bb_vc (letra_seccion_bb_vc)
        VALUES (p_letra)
        ON DUPLICATE KEY UPDATE letra_seccion_bb_vc = VALUES(letra_seccion_bb_vc);
      END IF;
    END;

    DROP TRIGGER IF EXISTS trg_secciones_before_ins;
    CREATE TRIGGER trg_secciones_before_ins BEFORE INSERT ON td_Secciones_bb_vc
    FOR EACH ROW
    BEGIN
      SET NEW.letra_seccion_bb_vc = fn_normalize_text_bb_vc(NEW.letra_seccion_bb_vc);
    END;

    DROP TRIGGER IF EXISTS trg_secciones_before_upd;
    CREATE TRIGGER trg_secciones_before_upd BEFORE UPDATE ON td_Secciones_bb_vc
    FOR EACH ROW
    BEGIN
      SET NEW.letra_seccion_bb_vc = fn_normalize_text_bb_vc(NEW.letra_seccion_bb_vc);
    END;

    DROP TRIGGER IF EXISTS trg_after_insert_grado_vc;
    CREATE TRIGGER trg_after_insert_grado_vc AFTER INSERT ON td_Grados_bb_vc
    FOR EACH ROW
    BEGIN
      INSERT IGNORE INTO td_Clases_bb_vc (ID_grado_clase_bb_vc, ID_seccion_clase_bb_vc)
      SELECT NEW.ID_grado_bb_vc, s.ID_seccion_bb_vc FROM td_Secciones_bb_vc s;
    END;

    DROP TRIGGER IF EXISTS trg_after_insert_seccion_vc;
    CREATE TRIGGER trg_after_insert_seccion_vc AFTER INSERT ON td_Secciones_bb_vc
    FOR EACH ROW
    BEGIN
      INSERT IGNORE INTO td_Clases_bb_vc (ID_grado_clase_bb_vc, ID_seccion_clase_bb_vc)
      SELECT g.ID_grado_bb_vc, NEW.ID_seccion_bb_vc FROM td_Grados_bb_vc g;
    END;

    DROP PROCEDURE IF EXISTS sp_backup_table_bb_vc;
    CREATE PROCEDURE sp_backup_table_bb_vc(IN p_table VARCHAR(64), IN p_suffix VARCHAR(255))
    BEGIN
      SET @backup = LEFT(CONCAT(p_table, '_backup_', p_suffix), 64);
      SET @sql1 = CONCAT('CREATE TABLE IF NOT EXISTS ', @backup, ' LIKE ', p_table);
      PREPARE stmt1 FROM @sql1; EXECUTE stmt1; DEALLOCATE PREPARE stmt1;
      SET @sql2 = CONCAT('TRUNCATE TABLE ', @backup);
      PREPARE stmt2 FROM @sql2; EXECUTE stmt2; DEALLOCATE PREPARE stmt2;
      SET @sql3 = CONCAT('INSERT INTO ', @backup, ' SELECT * FROM ', p_table);
      PREPARE stmt3 FROM @sql3; EXECUTE stmt3; DEALLOCATE PREPARE stmt3;
    END;

    DROP PROCEDURE IF EXISTS sp_delete_all_bb_vc;
    CREATE PROCEDURE sp_delete_all_bb_vc(IN p_table VARCHAR(64))
    BEGIN
      SET @sql = CONCAT('DELETE FROM ', p_table);
      PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
    END;

    DROP PROCEDURE IF EXISTS sp_restore_from_backup_bb_vc;
    CREATE PROCEDURE sp_restore_from_backup_bb_vc(IN p_table VARCHAR(64), IN p_suffix VARCHAR(255))
    BEGIN
      SET @backup = LEFT(CONCAT(p_table, '_backup_', p_suffix), 64);
      SET @exists = (SELECT COUNT(*) FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @backup);
      IF @exists > 0 THEN
        SET @sql1 = CONCAT('DELETE FROM ', p_table);
        PREPARE stmt1 FROM @sql1; EXECUTE stmt1; DEALLOCATE PREPARE stmt1;
        SET @sql2 = CONCAT('INSERT INTO ', p_table, ' SELECT * FROM ', @backup);
        PREPARE stmt2 FROM @sql2; EXECUTE stmt2; DEALLOCATE PREPARE stmt2;
        SET @sql3 = CONCAT('DROP TABLE ', @backup);
        PREPARE stmt3 FROM @sql3; EXECUTE stmt3; DEALLOCATE PREPARE stmt3;
      END IF;
    END;

    DROP PROCEDURE IF EXISTS sp_seed_defaults_vc_bb;
    CREATE PROCEDURE sp_seed_defaults_vc_bb()
    BEGIN
      INSERT INTO td_Rol_bb_vc (rol_bb_vc)
      SELECT 'Administrador' WHERE NOT EXISTS (SELECT 1 FROM td_Rol_bb_vc WHERE rol_bb_vc = 'Administrador');
      INSERT INTO td_Rol_bb_vc (rol_bb_vc)
      SELECT 'Profesor' WHERE NOT EXISTS (SELECT 1 FROM td_Rol_bb_vc WHERE rol_bb_vc = 'Profesor');

      INSERT INTO td_Usuarios_bb_vc (userName_bb_vc, correo_bb_vc, telefono_bb_vc, nombre_bb_vc, apellido_bb_vc, password_bb_vc)
      SELECT 'admin', 'admin@colegio.com', '0000000000', 'Admin', 'Principal', '123456'
      WHERE NOT EXISTS (SELECT 1 FROM td_Usuarios_bb_vc WHERE userName_bb_vc = 'admin');

      INSERT INTO td_UsuarioRol_bb_vc (ID_usuario_usuarioRol_bb_vc, ID_rol_usuarioRol_bb_vc)
      SELECT u.ID_usuario_bb_vc, r.ID_rol_bb_vc
      FROM td_Usuarios_bb_vc u JOIN td_Rol_bb_vc r ON r.rol_bb_vc = 'Administrador'
      WHERE u.userName_bb_vc = 'admin'
        AND NOT EXISTS (
          SELECT 1 FROM td_UsuarioRol_bb_vc ur
          WHERE ur.ID_usuario_usuarioRol_bb_vc = u.ID_usuario_bb_vc AND ur.ID_rol_usuarioRol_bb_vc = r.ID_rol_bb_vc
        );

      INSERT INTO td_Administradores_bb_vc (ID_usuarioRol_admin_bb_vc)
      SELECT ur.ID_usuarioRol_bb_vc
      FROM td_UsuarioRol_bb_vc ur
      JOIN td_Rol_bb_vc r ON r.ID_rol_bb_vc = ur.ID_rol_usuarioRol_bb_vc
      JOIN td_Usuarios_bb_vc u ON u.ID_usuario_bb_vc = ur.ID_usuario_usuarioRol_bb_vc
      WHERE r.rol_bb_vc = 'Administrador' AND u.userName_bb_vc = 'admin'
        AND NOT EXISTS (
          SELECT 1 FROM td_Administradores_bb_vc a WHERE a.ID_usuarioRol_admin_bb_vc = ur.ID_usuarioRol_bb_vc
        );

      INSERT INTO td_Usuarios_bb_vc (userName_bb_vc, correo_bb_vc, telefono_bb_vc, nombre_bb_vc, apellido_bb_vc, password_bb_vc)
      SELECT 'profe1', 'profesor@colegio.com', '04121234567', 'Carlos', 'Docente', '123456'
      WHERE NOT EXISTS (SELECT 1 FROM td_Usuarios_bb_vc WHERE userName_bb_vc = 'profe1');

      INSERT INTO td_UsuarioRol_bb_vc (ID_usuario_usuarioRol_bb_vc, ID_rol_usuarioRol_bb_vc)
      SELECT u.ID_usuario_bb_vc, r.ID_rol_bb_vc
      FROM td_Usuarios_bb_vc u JOIN td_Rol_bb_vc r ON r.rol_bb_vc = 'Profesor'
      WHERE u.userName_bb_vc = 'profe1'
        AND NOT EXISTS (
          SELECT 1 FROM td_UsuarioRol_bb_vc ur
          WHERE ur.ID_usuario_usuarioRol_bb_vc = u.ID_usuario_bb_vc AND ur.ID_rol_usuarioRol_bb_vc = r.ID_rol_bb_vc
        );

      INSERT INTO td_Profesores_bb_vc (ID_usuarioRol_profesor_bb_vc)
      SELECT ur.ID_usuarioRol_bb_vc
      FROM td_UsuarioRol_bb_vc ur
      JOIN td_Usuarios_bb_vc u ON u.ID_usuario_bb_vc = ur.ID_usuario_usuarioRol_bb_vc
      JOIN td_Rol_bb_vc r ON r.ID_rol_bb_vc = ur.ID_rol_usuarioRol_bb_vc
      WHERE r.rol_bb_vc = 'Profesor' AND u.userName_bb_vc = 'profe1'
        AND NOT EXISTS (
          SELECT 1 FROM td_Profesores_bb_vc p WHERE p.ID_usuarioRol_profesor_bb_vc = ur.ID_usuarioRol_bb_vc
        );

      INSERT INTO td_Dia_bb_vc (dia_bb_vc) SELECT 'lunes' WHERE NOT EXISTS (SELECT 1 FROM td_Dia_bb_vc WHERE dia_bb_vc = 'lunes');
      INSERT INTO td_Dia_bb_vc (dia_bb_vc) SELECT 'martes' WHERE NOT EXISTS (SELECT 1 FROM td_Dia_bb_vc WHERE dia_bb_vc = 'martes');
      INSERT INTO td_Dia_bb_vc (dia_bb_vc) SELECT 'miércoles' WHERE NOT EXISTS (SELECT 1 FROM td_Dia_bb_vc WHERE dia_bb_vc = 'miércoles');
      INSERT INTO td_Dia_bb_vc (dia_bb_vc) SELECT 'jueves' WHERE NOT EXISTS (SELECT 1 FROM td_Dia_bb_vc WHERE dia_bb_vc = 'jueves');
      INSERT INTO td_Dia_bb_vc (dia_bb_vc) SELECT 'viernes' WHERE NOT EXISTS (SELECT 1 FROM td_Dia_bb_vc WHERE dia_bb_vc = 'viernes');

      INSERT INTO td_Bloque_bb_vc (hora_bloque_bb_vc) SELECT '7:00 am' WHERE NOT EXISTS (SELECT 1 FROM td_Bloque_bb_vc WHERE hora_bloque_bb_vc = '7:00 am');
      INSERT INTO td_Bloque_bb_vc (hora_bloque_bb_vc) SELECT '8:00 am' WHERE NOT EXISTS (SELECT 1 FROM td_Bloque_bb_vc WHERE hora_bloque_bb_vc = '8:00 am');
      INSERT INTO td_Bloque_bb_vc (hora_bloque_bb_vc) SELECT '9:00 am' WHERE NOT EXISTS (SELECT 1 FROM td_Bloque_bb_vc WHERE hora_bloque_bb_vc = '9:00 am');
      INSERT INTO td_Bloque_bb_vc (hora_bloque_bb_vc) SELECT '10:00 am' WHERE NOT EXISTS (SELECT 1 FROM td_Bloque_bb_vc WHERE hora_bloque_bb_vc = '10:00 am');
      INSERT INTO td_Bloque_bb_vc (hora_bloque_bb_vc) SELECT '11:00 am' WHERE NOT EXISTS (SELECT 1 FROM td_Bloque_bb_vc WHERE hora_bloque_bb_vc = '11:00 am');
      INSERT INTO td_Bloque_bb_vc (hora_bloque_bb_vc) SELECT '12:00 pm' WHERE NOT EXISTS (SELECT 1 FROM td_Bloque_bb_vc WHERE hora_bloque_bb_vc = '12:00 pm');
      INSERT INTO td_Bloque_bb_vc (hora_bloque_bb_vc) SELECT '1:00 pm' WHERE NOT EXISTS (SELECT 1 FROM td_Bloque_bb_vc WHERE hora_bloque_bb_vc = '1:00 pm');
      INSERT INTO td_Bloque_bb_vc (hora_bloque_bb_vc) SELECT '2:00 pm' WHERE NOT EXISTS (SELECT 1 FROM td_Bloque_bb_vc WHERE hora_bloque_bb_vc = '2:00 pm');
      INSERT INTO td_Bloque_bb_vc (hora_bloque_bb_vc) SELECT '3:00 pm' WHERE NOT EXISTS (SELECT 1 FROM td_Bloque_bb_vc WHERE hora_bloque_bb_vc = '3:00 pm');
      INSERT INTO td_Bloque_bb_vc (hora_bloque_bb_vc) SELECT '4:00 pm' WHERE NOT EXISTS (SELECT 1 FROM td_Bloque_bb_vc WHERE hora_bloque_bb_vc = '4:00 pm');

      INSERT INTO td_TipoEspacio_bb_vc (tipo_bb_vc) SELECT 'Aula Genérica' WHERE NOT EXISTS (SELECT 1 FROM td_TipoEspacio_bb_vc WHERE tipo_bb_vc = 'Aula Genérica');
      INSERT INTO td_TipoEspacio_bb_vc (tipo_bb_vc) SELECT 'Espacio Especializado' WHERE NOT EXISTS (SELECT 1 FROM td_TipoEspacio_bb_vc WHERE tipo_bb_vc = 'Espacio Especializado');
    END;
  `;

  const migrateSQL_vc_bb = `
    ALTER TABLE td_Grados_bb_vc MODIFY COLUMN nro_grado_bb_vc INT NOT NULL;
    ALTER TABLE td_Secciones_bb_vc MODIFY COLUMN letra_seccion_bb_vc VARCHAR(10) NOT NULL;
  `;

  await pool_vc_bb.query(schemaSQL_vc_bb);
  await pool_vc_bb.query(seedSQL_vc_bb);
  await pool_vc_bb.query(routinesSQL_vc_bb);
  await pool_vc_bb.query(migrateSQL_vc_bb);
  await pool_vc_bb.query('CALL sp_seed_defaults_vc_bb();');
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

export async function withConnection_vc_bb(fn) {
  const conn = await pool_vc_bb.getConnection();
  try {
    const result = await fn(conn);
    return result;
  } finally {
    conn.release();
  }
}

export default {
  initDatabase_vc_bb,
  query_vc_bb,
  getOne_vc_bb,
  execute_vc_bb,
  withConnection_vc_bb,
};
