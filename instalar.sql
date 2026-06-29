-- ===========================================
-- SQL PARA SUPABASE
-- Pega en: SQL Editor → New Query → Run
-- ===========================================

-- 1. Crear la tabla de proyectos
CREATE TABLE IF NOT EXISTS proyectos (
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

-- 2. Insertar proyectos (no duplica si ya existen)
INSERT INTO proyectos (id, nombre, proyecto, grado) VALUES
-- 4° GRADO
('4a_camila', 'Camila', 'Caseta de pago', '4°'),
('4a_dylan', 'Dylan', 'Alarma', '4°'),
('4a_nicole', 'Nicole', 'Semáforo', '4°'),
('4a_sofi', 'Sofi', 'Estacionamiento automático', '4°'),
('4a_jade', 'Jade', 'Casa inteligente', '4°'),
('4a_naty', 'Naty', 'Grúa', '4°'),
('4a_adonai', 'Adonai', 'Juego de memoria', '4°'),
('4a_santi', 'Santi', 'Estacionamiento', '4°'),
('4a_ander', 'Ander', 'Estación meteorológica', '4°'),
('4a_ram', 'Ram', 'Regla electrónica', '4°'),
('4a_domi', 'Domi', 'Puerta con contraseña', '4°'),
-- 5° GRADO
('5a_alex', 'Alex', 'Caja de apertura automática', '5°'),
('5a_fer', 'Fer', 'Semáforo patrulla', '5°'),
('5a_regis', 'Regis', 'Contador de personas', '5°'),
('5a_iker', 'Iker', 'Trivia de tablas de multiplicar', '5°'),
('5a_said', 'Said', 'Portero eléctrico', '5°'),
('5a_gael', 'Gael', 'Radar', '5°'),
('5a_david', 'David', 'Caja fuerte', '5°'),
('5a_trinidad', 'Trinidad', 'Grúa', '5°'),
-- 6° GRADO
('6a_maria', 'María', 'Casa inteligente', '6°'),
('6a_yair', 'Yair', 'Regla electrónica', '6°'),
('6a_karen', 'Karen', 'Trivia de memoria', '6°'),
('6a_cesar', 'Cesar', 'Sistema de seguridad', '6°'),
('6a_mia', 'Mía', 'Grúa', '6°'),
('6a_nico', 'Nico', 'Puerta automática', '6°'),
('6a_pepe', 'Pepe', 'Bomba digital', '6°'),
('6a_randy', 'Randy', 'Portón automático', '6°'),
('6a_aline', 'Aline', 'Garaje automático', '6°'),
('6a_fer', 'Fer', 'Juego de memoria', '6°'),
('6a_daman', 'Damán', 'Puerta con contraseña', '6°'),
('6a_owen', 'Owen', 'Juego de puntería', '6°'),
('6a_lalito', 'Lalito', 'Sistema de luces', '6°')
ON CONFLICT (id) DO NOTHING;

-- 3. Crear función para votar
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
    ingenio = CASE WHEN inc_ingenio > 0 THEN ingenio + inc_ingenio ELSE ingenio END,
    votos_ingenio = CASE WHEN inc_ingenio > 0 THEN votos_ingenio + 1 ELSE votos_ingenio END,
    estetica = CASE WHEN inc_estetica > 0 THEN estetica + inc_estetica ELSE estetica END,
    votos_estetica = CASE WHEN inc_estetica > 0 THEN votos_estetica + 1 ELSE votos_estetica END,
    funcion = CASE WHEN inc_funcion > 0 THEN funcion + inc_funcion ELSE funcion END,
    votos_funcion = CASE WHEN inc_funcion > 0 THEN votos_funcion + 1 ELSE votos_funcion END
  WHERE id = proyecto_id;
END;
$$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION incrementar_voto TO anon;

-- 4. Desactivar RLS
ALTER TABLE proyectos DISABLE ROW LEVEL SECURITY;
GRANT SELECT ON proyectos TO anon;

-- 5. Activar Realtime (corre esto si no lo has hecho antes)
ALTER PUBLICATION supabase_realtime ADD TABLE proyectos;
