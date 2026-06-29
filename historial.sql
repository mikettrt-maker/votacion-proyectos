-- ===========================================
-- CREAR TABLA DE HISTORIAL DE VOTOS
-- Pega en: SQL Editor → New Query → Run
-- ===========================================

-- 1. Crear tabla para guardar cada voto individual con timestamp
CREATE TABLE IF NOT EXISTS votos_historial (
  id BIGSERIAL PRIMARY KEY,
  proyecto_id TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  ingenio INT NOT NULL,
  estetica INT NOT NULL,
  funcion INT NOT NULL
);

GRANT ALL ON votos_historial TO anon;
GRANT USAGE ON SEQUENCE votos_historial_id_seq TO anon;

-- 2. Actualizar la función para que también guarde el historial
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

  IF inc_ingenio > 0 OR inc_estetica > 0 OR inc_funcion > 0 THEN
    INSERT INTO votos_historial (proyecto_id, ingenio, estetica, funcion)
    VALUES (proyecto_id, inc_ingenio, inc_estetica, inc_funcion);
  END IF;
END;
$$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION incrementar_voto TO anon;

-- 3. Activar Realtime en la nueva tabla
ALTER PUBLICATION supabase_realtime ADD TABLE votos_historial;
