// ============================================================
// db.js — Configuración de la conexión a PostgreSQL (Supabase)
// ============================================================
// Este módulo crea un "Pool" de conexiones con el paquete `pg`
// (node-postgres). El Pool reutiliza conexiones a la base de
// datos en lugar de abrir una nueva en cada consulta, lo que
// hace que la app sea más rápida y estable.
// ============================================================

// Cargamos las variables de entorno definidas en el archivo `.env`
require("dotenv").config();

// Importamos la clase Pool del paquete `pg`
const { Pool } = require("pg");

// Creamos el Pool de conexiones usando la URI que está en DATABASE_URL
const pool = new Pool({
  // La URI viene del archivo .env, p. ej.:
  // postgresql://usuario:password@host:puerto/base_de_datos
  connectionString: process.env.DATABASE_URL,

  // Tiempo máximo de espera (en ms) para establecer una conexión
  connectionTimeoutMillis: 5000,

  // Tiempo máximo de inactividad de una conexión antes de cerrarla
  idleTimeoutMillis: 30000,
});

// Exportamos el Pool para poder usarlo en otros archivos (p. ej. server.js)
module.exports = pool;
