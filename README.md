# Cursos FacEduc

Oferta de cursos de la Facultad de Educación — Uniandes 2026-1.

## Stack

- **Frontend:** Next.js 15 (App Router)
- **CMS / Admin:** Payload CMS v3
- **Base de datos:** SQLite
- **Deploy:** Railway (desde GitHub)

---

## Primeros pasos (local)

### 1. Instalar Node.js ≥ 20

Descarga desde https://nodejs.org

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
# Edita .env con tus valores
```

### 4. Correr en desarrollo

```bash
npm run dev
```

Abre:
- **Sitio:** http://localhost:3000
- **Panel admin:** http://localhost:3000/admin

La primera vez que abras el admin, Payload te pedirá crear un usuario administrador.

---

## Panel de administración

Ve a `/admin` para:

| Qué hacer | Dónde |
|---|---|
| Agregar/editar cursos | Colecciones → Cursos |
| Agregar/editar profesores | Colecciones → Profesores |
| Subir fotos | Colecciones → Imágenes |

### Campos de un curso

- **Nombre del curso** y segunda línea opcional
- **Categoría:** Pregrado / Posgrado
- **Tipo de programa:** LIC / MS / ESP / DOC
- **Código, créditos, semanas, NRC, modalidad**
- **Horario:** agrega los bloques con día + hora inicio + hora fin
- **Foto:** arrastra o selecciona una imagen
- **Descripción:** editor de texto enriquecido
- **Profesor/a:** selecciona de la lista
- **Se oferta en este período:** si lo desmarcas, aparece el overlay "NO SE OFERTA EN 2026-1"

---

## Deploy en Railway

### 1. Crear repositorio en GitHub

```bash
cd facu-cursos
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/TU_USUARIO/facu-cursos.git
git push -u origin main
```

### 2. Conectar en Railway

1. Ve a https://railway.app → New Project → Deploy from GitHub
2. Selecciona el repo `facu-cursos`
3. En la pestaña **Variables**, agrega:

| Variable | Valor |
|---|---|
| `PAYLOAD_SECRET` | Una cadena larga y aleatoria |
| `DATABASE_URI` | `file:./db.sqlite` |
| `NEXT_PUBLIC_SERVER_URL` | La URL que Railway te asigne |

4. Railway detecta `railway.toml` y hace el deploy automáticamente.
5. En cada `git push` se redeploya solo.

### Persistencia de datos en Railway

Railway ofrece **Volumes** para persistir el archivo SQLite. En el panel de Railway:
- Ve a tu servicio → Storage → Add Volume
- Mount path: `/app` (donde vive `db.sqlite`)

Sin Volume, los datos se pierden en cada deploy. Con Volume, persisten.

---

## Estructura del proyecto

```
src/
  app/
    (app)/          # Sitio público
      page.tsx      # Página de inicio
      pregrado/     # Cursos de pregrado
      posgrado/     # Cursos de posgrado
      profes/       # Profesores
    (payload)/      # Panel admin (Payload)
  collections/
    Courses.ts      # Esquema de cursos
    Professors.ts   # Esquema de profesores
    Media.ts        # Manejo de imágenes
    Users.ts        # Usuarios del admin
  components/
    CourseCard.tsx   # Tarjeta de curso
    CourseDrawer.tsx # Detalle lateral al hacer click
    CoursesGrid.tsx  # Grid con filtros
    PageHeader.tsx   # Navegación compartida
payload.config.ts   # Configuración del CMS
```
