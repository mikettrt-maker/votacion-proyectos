-- ===========================================
-- SQL PARA SUPABASE
-- Pega todo esto en: SQL Editor → New Query → Run
-- ===========================================

-- 1. Crear la tabla de proyectos
CREATE TABLE proyectos (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  proyecto TEXT NOT NULL,
  grado TEXT NOT NULL,
  ingenio INTEGER DEFAULT 0,
  estetica INTEGER DEFAULT 0,
  funcion INTEGER DEFAULT 0,
  votos_ingenio INTEGER DEFAULT 0,
  votos_estetica INTEGER DEFAULT 0,
  votos_funcion INTEGER DEFAULT 0
);

-- 2. Insertar los 8 proyectos de 5° grado
INSERT INTO proyectos (id, nombre, proyecto, grado) VALUES
('5a_alex', 'Alex', 'Caja de apertura automática', '5°'),
('5a_fer', 'Fer', 'Semáforo patrulla', '5°'),
('5a_regis', 'Regis', 'Contador de personas', '5°'),
('5a_iker', 'Iker', 'Trivia de tablas de multiplicar', '5°'),
('5a_said', 'Said', 'Portero eléctrico', '5°'),
('5a_gael', 'Gael', 'Radar', '5°'),
('5a_david', 'David', 'Caja fuerte', '5°'),
('5a_trinidad', 'Trinidad', 'Grúa', '5°');

-- 3. Crear la función para votar (incrementa los contadores de forma segura)
CREATE OR REPLACE FUNCTION incrementar_voto(
  proyecto_id TEXT,
  inc_ingenio INT,
  inc_estetica INT,
  inc_funcion INT
) RETURNS void
SECURITY DEFINER
AS $$
BEGIN
  UPDATE proyectos
  SET
    ingenio = ingenio + inc_ingenio,
    votos_ingenio = votos_ingenio + 1,
    estetica = estetica + inc_estetica,
    votos_estetica = votos_estetica + 1,
    funcion = funcion + inc_funcion,
    votos_funcion = votos_funcion + 1
  WHERE id = proyecto_id;
END;
$$ LANGUAGE plpgsql;

-- 4. Permitir que cualquier usuario (anon) ejecute la función
GRANT EXECUTE ON FUNCTION incrementar_voto TO anon;

-- 5. Desactivar seguridad por filas para que la página pueda leer proyectos
ALTER TABLE proyectos DISABLE ROW LEVEL SECURITY;
GRANT SELECT ON proyectos TO anon;

-- 6. Activar Realtime para que los resultados se actualicen solos
-- Ve a: Database → Replication → desliza "Enable Realtime" para la tabla "proyectos"
