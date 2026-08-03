-- ============================================================
-- seed.sql — Datos de prueba para la tabla 'contactos' (local)
-- Ejecutar: psql -U postgres -h localhost -d agenda -f seed.sql
-- ============================================================

INSERT INTO public.contactos (nombre, telefono) VALUES
  ('Ana García', '612 345 678'),
  ('Luis Pérez', '655 111 222'),
  ('Marta López', '688 999 000'),
  ('Carlos Ruiz', '600 123 456'),
  ('Elena Díaz', '677 888 999');
