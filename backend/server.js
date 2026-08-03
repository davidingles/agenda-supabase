// ============================================================
// server.js — API REST de Contactos (CRUD completo)
// ============================================================
// Este archivo levanta un servidor Express que expone una API
// REST desacoplada. Cualquier frontend (esta u otra app) puede
// consumirla haciendo peticiones HTTP con fetch.
//
//   GET    /api/contactos        -> Listar todos los contactos
//   POST   /api/contactos        -> Crear un contacto
//   PUT    /api/contactos/:id    -> Actualizar un contacto
//   DELETE /api/contactos/:id    -> Eliminar un contacto
// ============================================================

// ---------- 1. Cargar variables de entorno (.env) ----------
require("dotenv").config();

// ---------- 2. Importar dependencias ----------
const express = require("express"); // Framework web para Node.js
const cors = require("cors"); // Permite peticiones desde otros orígenes (frontend)
const pool = require("./db"); // Pool de conexiones a PostgreSQL (Supabase)

// ---------- 3. Crear la aplicación Express ----------
const app = express();
const PORT = process.env.PORT || 3000; // Puerto del servidor (3000 por defecto)

// ---------- 4. Middlewares ----------
// `express.json()` -> Permite recibir el body de las peticiones en formato JSON
app.use(express.json());

// `cors()` -> Habilita CORS para que el frontend (http://localhost:5500,
// GitHub Pages, etc.) pueda llamar a esta API sin errores de origen cruzado.
app.use(cors());

// Middleware de log simple: imprime en consola cada petición recibida
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ---------- 5. Rutas de la API ----------

// [RUTA BASE] Comprobación de que el servidor está vivo
app.get("/", (req, res) => {
  res.json({ mensaje: "API de Contactos funcionando 🚀" });
});

// [READ] Obtener todos los contactos
// GET /api/contactos
app.get("/api/contactos", async (req, res) => {
  try {
    // Consulta SQL: seleccionamos todos los registros ordenados por id
    const resultado = await pool.query(
      "SELECT id, nombre, telefono FROM contactos ORDER BY id ASC"
    );
    // Devolvemos la lista de contactos
    res.json(resultado.rows);
  } catch (error) {
    // Si algo falla, respondemos con un error 500 (Error interno del servidor)
    console.error("Error al obtener contactos:", error);
    res.status(500).json({ error: "Error al obtener los contactos" });
  }
});

// [CREATE] Crear un nuevo contacto
// POST /api/contactos   -> body: { nombre, telefono }
app.post("/api/contactos", async (req, res) => {
  // Extraemos los campos que envía el frontend desde el body de la petición
  const { nombre, telefono } = req.body;

  // Validación básica: el nombre es obligatorio
  if (!nombre) {
    return res.status(400).json({ error: "El campo 'nombre' es obligatorio" });
  }

  try {
    // Consulta SQL parametrizada ($1, $2) para evitar inyección SQL.
    // La cláusula RETURNING nos devuelve el registro recién creado.
    const resultado = await pool.query(
      "INSERT INTO contactos (nombre, telefono) VALUES ($1, $2) RETURNING id, nombre, telefono",
      [nombre, telefono || null]
    );
    // Respondemos con el contacto creado y el código 201 (Created)
    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error("Error al crear contacto:", error);
    res.status(500).json({ error: "Error al crear el contacto" });
  }
});

// [UPDATE] Actualizar un contacto existente por su id
// PUT /api/contactos/:id   -> body: { nombre, telefono }
app.put("/api/contactos/:id", async (req, res) => {
  const { id } = req.params; // El id viene en la URL
  const { nombre, telefono } = req.body;

  try {
    // Actualizamos el registro y devolvemos el resultado con RETURNING
    const resultado = await pool.query(
      "UPDATE contactos SET nombre = $1, telefono = $2 WHERE id = $3 RETURNING id, nombre, telefono",
      [nombre, telefono, id]
    );

    // Si no se encontró ningún registro con ese id (rowCount === 0), respondemos 404
    if (resultado.rowCount === 0) {
      return res.status(404).json({ error: "Contacto no encontrado" });
    }

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error("Error al actualizar contacto:", error);
    res.status(500).json({ error: "Error al actualizar el contacto" });
  }
});

// [DELETE] Eliminar un contacto por su id
// DELETE /api/contactos/:id
app.delete("/api/contactos/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Eliminamos el registro y comprobamos si existía
    const resultado = await pool.query(
      "DELETE FROM contactos WHERE id = $1 RETURNING id",
      [id]
    );

    // Si no existía, respondemos 404
    if (resultado.rowCount === 0) {
      return res.status(404).json({ error: "Contacto no encontrado" });
    }

    // Respondemos 204 (Sin contenido) indicando que se eliminó correctamente
    res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar contacto:", error);
    res.status(500).json({ error: "Error al eliminar el contacto" });
  }
});

// ---------- 6. Iniciar el servidor ----------
app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
});
