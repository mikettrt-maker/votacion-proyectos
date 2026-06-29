# Votación de Proyectos Escolares 🗳️

Página web para que los padres voten por los proyectos de sus hijos (5° grado) con estrellas en 3 categorías. Resultados en vivo en el proyector.

## 📋 Categorías de votación

- 💡 **Proyecto Más Ingenioso** — Originalidad y creatividad
- 🎨 **Mejor Estética** — Diseño y acabados
- ⚙️ **Mejor Funcionamiento** — Qué tan bien funciona

## 🚀 Instalación paso a paso

### 1. Ejecutar el SQL en Supabase

1. Abre https://supabase.com → entra a tu proyecto
2. Ve a **SQL Editor** → **New Query**
3. Abre el archivo `instalar.sql` de esta carpeta, copia TODO el contenido y pégalo
4. Dale en **Run**
5. Ve a **Database** → **Replication** → activa **Enable Realtime** para la tabla `proyectos`

### 2. Crear el repositorio en GitHub

1. Abre https://github.com y inicia sesión
2. Haz clic en el botón verde **"New"** (o **"Create repository"**)
3. Nombre del repositorio: `votacion-proyectos`
4. Déjalo como **público**
5. **NO** marques "Initialize with README" (ya tenemos uno)
6. Dale en **Create repository**
7. **No cierres esa página** — la vas a necesitar

### 3. Subir los archivos a GitHub

Abre **PowerShell** (Windows) y pega esto:

```powershell
cd C:\Users\rosy_\Documents\votacion-proyectos

git init
git add .
git commit -m "Votacion proyectos 5 grado"

git branch -M main
git remote add origin https://github.com/mikettrt-maker/votacion-proyectos.git
git push -u origin main
```

Listo, ya quedó configurado con tu usuario `mikettrt-maker`.

### 4. Activar GitHub Pages

1. En tu repositorio de GitHub, ve a **Settings** → **Pages**
2. En **Source**, selecciona **Deploy from a branch**
3. Branch: `main`, folder: `/ (root)`
4. Dale a **Save**
5. Espera 1-2 minutos y tu página estará en:
   ```
https://mikettrt-maker.github.io/votacion-proyectos/
   ```

### 5. Obtener los links finales

| Página | Link | Para qué |
|--------|------|----------|
| `index.html` | `https://mikettrt-maker.github.io/votacion-proyectos/` | Padres votan en su celular |
| `resultados.html` | `https://mikettrt-maker.github.io/votacion-proyectos/resultados.html` | Proyector en vivo |
| `admin.html` | `https://mikettrt-maker.github.io/votacion-proyectos/admin.html` | Reiniciar votos |

### 6. Generar código QR

1. Abre https://www.qr-code-generator.com/
2. Pega el link de `index.html`
3. Descarga el QR y lo imprimes para pegarlo en el salón

## 🎯 Cómo usarlo el día del evento

1. Abres `resultados.html` en la laptop conectada al proyector
2. Los padres escanean el QR → se abre `index.html` en su celular
3. Cada padre **selecciona a su hijo** de la lista
4. Ve todos los proyectos y da ⭐ 1-5 en cada categoría
5. **El proyecto de su hijo aparece bloqueado** 🔒 — no puede votar por él
6. Los votos aparecen **en vivo en el proyector**
7. Al final, ves el Top 3 de cada categoría 🥇🥈🥉

### Para reiniciar la votación (otro grupo)

1. Abres `admin.html`
2. Das clic en **"REINICIAR TODOS LOS VOTOS"**

## 📁 Archivos del proyecto

| Archivo | Descripción |
|---------|-------------|
| `index.html` | Página de votación para padres (celular) |
| `resultados.html` | Pantalla para proyector con resultados en vivo |
| `admin.html` | Panel para reiniciar votos |
| `estilos.css` | Diseño visual |
| `supabase.js` | Configuración de Supabase |
| `app.js` | Lógica de votación |
| `resultados.js` | Lógica de resultados en vivo |
| `instalar.sql` | SQL para configurar la base de datos |
