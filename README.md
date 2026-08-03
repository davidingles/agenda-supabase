# 📒 mi-app-crud — Agenda de Contactos (CRUD)

Aplicación web sencilla para aprender un CRUD completo con **separación total entre Frontend y Backend**.

| Capa | Tecnología | Despliegue futuro |
|------|-----------|-------------------|
| **Frontend** | HTML5, CSS3 y JavaScript vanilla | GitHub Pages |
| **Backend** | Node.js + Express.js (API REST) | Render |
| **Base de datos** | PostgreSQL alojado en Supabase | — |

---

## 📁 Estructura del proyecto

```
mi-app-crud/
├── backend/          # API REST desacoplada
│   ├── node_modules/
│   ├── .env          # Variables de entorno (NO se sube a Git)
│   ├── .gitignore
│   ├── package.json
│   ├── db.js         # Conexión a PostgreSQL (Pool de pg)
│   └── server.js     # Servidor Express + rutas CRUD
├── frontend/         # Interfaz 100% vanilla
│   ├── index.html
│   ├── style.css
│   └── app.js
└── database.sql      # Script para crear la tabla en Supabase
```

---

## 🚀 Puesta en marcha

### 1. Comandos de PowerShell (`pwsh`)

```powershell
# 1) Crear la estructura de carpetas
New-Item -ItemType Directory -Force -Path "mi-app-crud\backend", "mi-app-crud\frontend"

# 2) Entrar en la carpeta del backend
cd mi-app-crud\backend

# 3) Inicializar el proyecto Node (crea package.json)
npm init -y

# 4) Instalar las dependencias
npm install express pg dotenv cors

# (Opcional) Instalar nodemon como dependencia de desarrollo
# npm install -D nodemon
```

### 2. Crear la tabla en Supabase

1. Entra en tu proyecto de [Supabase](https://supabase.com).
2. Ve a **SQL Editor** → **New query**.
3. Copia y ejecuta el contenido de [`database.sql`](./database.sql).

### 3. Configurar la conexión a la base de datos

1. En Supabase ve a **Project Settings → Database → Connection string**.
2. Copia la URI de conexión (formato `postgresql://...`).
3. Ábrela en `backend/.env` y reemplaza el valor de `DATABASE_URL`:

```env
DATABASE_URL=postgresql://postgres.TU_PROYECTO:TU_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

### 4. Arrancar el backend

```powershell
cd mi-app-crud\backend
npm start          # o bien: node server.js
# Verás: ✅ Servidor escuchando en http://localhost:3000
```

### 5. Abrir el frontend

Abre el archivo `frontend/index.html` en tu navegador (doble clic o con Live Server).

> 💡 La API ya está abierta con **CORS**, así que puede consumirla cualquier frontend, esté donde esté (localhost, GitHub Pages, etc.).

---

## 🔌 Endpoints de la API REST

| Método | Ruta                  | Descripción                          |
|--------|-----------------------|--------------------------------------|
| `GET`  | `/api/contactos`      | Obtener todos los contactos          |
| `POST` | `/api/contactos`      | Crear un contacto `{ nombre, telefono }` |
| `PUT`  | `/api/contactos/:id`  | Actualizar un contacto por su `id`   |
| `DELETE` | `/api/contactos/:id` | Eliminar un contacto por su `id`     |

Prueba rápida desde PowerShell:

```powershell
# Listar contactos
Invoke-RestMethod -Uri "http://localhost:3000/api/contactos"

# Crear un contacto
$body = @{ nombre = "Ana"; telefono = "612 345 678" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/contactos" -Method Post -Body $body -ContentType "application/json"
```

---

## 🛡️ Buenas prácticas aplicadas

- **Separación total** Frontend/Backend → se despliegan de forma independiente.
- **API REST desacoplada** → cualquier cliente puede consumirla.
- **Consultas SQL parametrizadas** (`$1`, `$2`) → protección contra inyección SQL.
- **CORS habilitado** → el frontend puede llamar a la API desde cualquier origen.
- **`.env` en `.gitignore`** → los secretos nunca se suben al repositorio.
- **`RETURNING`** en las consultas → el servidor devuelve el registro afectado.
- **Manejo de errores** → respuestas HTTP con códigos correctos (400/404/500).
