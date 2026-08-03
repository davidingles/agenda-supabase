-- ============================================================
-- database.sql — Script para crear la tabla en Supabase
-- ============================================================
-- Cómo usarlo:
--   1. Ve a tu proyecto en Supabase.
--   2. Menú lateral -> SQL Editor.
--   3. Pega este script y pulsa "Run".
-- ============================================================

-- Creamos la tabla `contactos` si no existe.
-- `id`       -> Número autoincremental (serial) que identifica cada fila.
-- `nombre`   -> Texto obligatorio (NOT NULL) de hasta 255 caracteres.
-- `telefono` -> Texto opcional de hasta 20 caracteres.
-- `created_at` -> Fecha de creación (opcional, útil para ordenar).

CREATE TABLE IF NOT EXISTS public.contactos (
  id SERIAL PRIMARY KEY,               -- Clave primaria autoincremental
  nombre VARCHAR(255) NOT NULL,        -- Nombre del contacto (obligatorio)
  telefono VARCHAR(20),                -- Teléfono del contacto (opcional)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() -- Fecha de creación
);

-- (Opcional) Permitir que la API (REST/anon) pueda leer y escribir la tabla.
-- Desactiva la "Row Level Security" para esta tabla durante el aprendizaje.
ALTER TABLE public.contactos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir acceso completo a contactos"
  ON public.contactos
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- Datos de prueba (opcional): puedes descomentar estas líneas
-- para insertar contactos de ejemplo y probar la API enseguida.
-- ============================================================
-- INSERT INTO public.contactos (nombre, telefono) VALUES
--   ('Ana García', '612 345 678'),
--   ('Luis Pérez', '655 111 222'),
--   ('Marta López', '688 999 000');
