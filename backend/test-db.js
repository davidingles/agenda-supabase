// test-db.js — Prueba rápida de conexión a Supabase
// Uso: node test-db.js
require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

(async () => {
  try {
    const r = await pool.query(
      "SELECT current_database() AS db, current_user AS usr, current_setting('server_version') AS version, to_regclass('public.contactos') AS tabla"
    );
    const row = r.rows[0];
    console.log("✅ Conexión OK");
    console.log(`   Base de datos: ${row.db}`);
    console.log(`   Usuario:       ${row.usr}`);
    console.log(`   Versión PG:    ${row.version}`);
    console.log(`   Tabla 'contactos': ${row.tabla ? "EXISTE 🎉" : "NO existe (ejecuta database.sql en el SQL Editor)"}`);
  } catch (err) {
    console.error("❌ Error de conexión:");
    console.error("   ", err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
})();
