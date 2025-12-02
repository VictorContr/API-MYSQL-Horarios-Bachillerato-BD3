# API MySQL — Horarios Bachillerato BD3

API básica en MySQL (Express + mysql2) que:
- Crea automáticamente la base de datos y el esquema mínimo.
- Expone un CRUD de usuarios.
- Implementa un login funcional.
- Configura todo vía variables de entorno en `.env`.

## Requisitos
- Node.js 18+ (recomendado en Laragon).
- Para desarrollo local: MySQL (Laragon: `MySQL 5.7/8.x`) con credenciales en `.env`.
- Para producción en Railway: usa las variables de entorno provistas por Railway (`MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`).

## Estructura del proyecto
- `api/`
  - `db.js`: conexión MySQL, creación de BD, esquema y seed.
  - `controllers/`
    - `usuarios.controller.js`: controlador CRUD de usuarios.
    - `login.controller.js`: controlador de login.
  - `models/`
    - `usuario.model.js`: consultas y operaciones sobre usuarios.
    - `rol.model.js`: obtención de roles.
    - `usuarioRol.model.js`: relación usuario-rol.
- `routes/`
  - `usuarios.routes.js`: rutas CRUD de usuarios.
  - `login.routes.js`: ruta de login.
- `middleware/`
  - `auth.middleware.js`: stub `requireAdmin_vc_bb` (permite todas las operaciones por ahora).
- `index.js`: servidor Express, montaje de rutas e inicialización de BD.
- `.env`: configuración de conexión MySQL y puerto de la API.
- `package.json`: dependencias y scripts.

## Instalación y ejecución
- Instalar dependencias:
  - `npm install`
- Ejecutar en desarrollo (con reinicio automático):
  - `npm run dev`
- Ejecutar en producción:
  - `npm start`

Al iniciar, la API:
- Crea la BD `DBHorarios_bb_vc` si no existe.
- Crea tablas mínimas y relaciones.
- Inserta roles iniciales y el usuario `admin`.

## Esquema de base de datos (mínimo)
- `td_Usuarios_bb_vc`
  - `ID_usuario_bb_vc` (PK, AUTO_INCREMENT)
  - `userName_bb_vc` (UNIQUE, NOT NULL)
  - `nombre_bb_vc`, `apellido_bb_vc`, `correo_bb_vc`, `telefono_bb_vc`
  - `password_bb_vc` (NOT NULL)
- `td_Rol_bb_vc`
  - `ID_rol_bb_vc` (PK, AUTO_INCREMENT)
  - `rol_bb_vc` (UNIQUE)
- `td_UsuarioRol_bb_vc`
  - `ID_usuarioRol_bb_vc` (PK, AUTO_INCREMENT)
  - `ID_usuario_usuarioRol_bb_vc` (FK → `td_Usuarios_bb_vc`)
  - `ID_rol_usuarioRol_bb_vc` (FK → `td_Rol_bb_vc`)
  - `UNIQUE (ID_usuario_usuarioRol_bb_vc, ID_rol_usuarioRol_bb_vc)`
- `td_Profesores_bb_vc`
  - `ID_profesor_bb_vc` (PK, AUTO_INCREMENT)
  - `ID_usuarioRol_profesor_bb_vc` (FK → `td_UsuarioRol_bb_vc`, UNIQUE)

Seed inicial:
- Roles: `Administrador`, `Profesor`.
- Usuario admin: `userName=admin`, `password=123456`.

## Endpoints
Base URL:
- Desarrollo: `http://localhost:3300`
- Producción (Railway): `https://api-mysql-horarios-bachillerato-bd3-production.up.railway.app`

- `POST /api/login`
  - Body:
    ```json
    {"userName_bb_vc": "admin", "password_bb_vc": "123456"}
    ```
  - Respuesta: datos del usuario y `rol`.

- `GET /api/usuarios`
  - Lista todos los usuarios, incluyendo su rol (si asignado).

- `GET /api/usuarios/:id`
  - Obtiene un usuario por ID.

- `POST /api/usuarios` (requireAdmin_vc_bb — actualmente abierto)
  - Body mínimo:
    ```json
    {
      "userName_bb_vc": "usuario1",
      "nombre_bb_vc": "Nombre",
      "apellido_bb_vc": "Apellido",
      "password_bb_vc": "secreto",
      "correo_bb_vc": "correo@dominio.com",
      "telefono_bb_vc": "0000000000",
      "rol_bb_vc": "Profesor" // opcional: "Administrador" o "Profesor"
    }
    ```

- `PUT /api/usuarios/:id` (requireAdmin_vc_bb — actualmente abierto)
  - Actualiza los campos proporcionados. Si cambia `rol_bb_vc`, actualiza la relación.

- `DELETE /api/usuarios/:id` (requireAdmin_vc_bb — actualmente abierto)
  - Elimina el usuario y sus relaciones por cascada.

## Ejemplos rápidos (curl)
- Login:
  - Dev: `curl -X POST http://localhost:3300/api/login -H "Content-Type: application/json" -d '{"userName_bb_vc":"admin","password_bb_vc":"123456"}'`
  - Prod: `curl -X POST https://api-mysql-horarios-bachillerato-bd3-production.up.railway.app/api/login -H "Content-Type: application/json" -d '{"userName_bb_vc":"admin","password_bb_vc":"123456"}'`
- Crear usuario:
  - Dev: `curl -X POST http://localhost:3300/api/usuarios -H "Content-Type: application/json" -d '{"userName_bb_vc":"profe2","nombre_bb_vc":"Ana","apellido_bb_vc":"Gómez","password_bb_vc":"123456","correo_bb_vc":"ana@mail.com","telefono_bb_vc":"111-1111","rol_bb_vc":"Profesor"}'`
  - Prod: `curl -X POST https://api-mysql-horarios-bachillerato-bd3-production.up.railway.app/api/usuarios -H "Content-Type: application/json" -d '{"userName_bb_vc":"profe2","nombre_bb_vc":"Ana","apellido_bb_vc":"Gómez","password_bb_vc":"123456","correo_bb_vc":"ana@mail.com","telefono_bb_vc":"111-1111","rol_bb_vc":"Profesor"}'`
- Listar usuarios:
  - Dev: `curl http://localhost:3300/api/usuarios`
  - Prod: `curl https://api-mysql-horarios-bachillerato-bd3-production.up.railway.app/api/usuarios`

## Notas
- Seguridad: las contraseñas se guardan en texto plano en esta versión para replicar el flujo actual; se recomienda migrar a `bcrypt` y validar login con hash.
- Autorización: `requireAdmin_vc_bb` es un stub que permite todo; se sugiere integrar JWT/sesión para proteger rutas.
- Tailwind CSS no es requerido en esta API.

## Próximos pasos sugeridos
- Agregar hashing de contraseñas y actualización de login.
- Añadir validación y sanitización de entradas.
- Extender el esquema (pensum, asignaturas, grados, secciones, disponibilidad) para igualar el proyecto `Proyecto-DB3`.
- Implementar control de acceso real (roles) vía JWT.
