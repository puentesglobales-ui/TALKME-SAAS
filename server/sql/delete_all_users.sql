-- ⚠️ PELIGRO: ESTO BORRA TODOS LOS USUARIOS ⚠️
-- Ejecuta esto en Supabase SQL Editor para limpiar la base de datos y probar el registro desde cero.

DELETE FROM auth.users;

-- Supabase borrará automáticamente los perfiles asociados gracias al "ON DELETE CASCADE".
