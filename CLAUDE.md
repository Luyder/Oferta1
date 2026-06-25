# Cursos FacEduc — Catálogo de cursos

Sitio público + panel de administración para el catálogo de cursos de la
Facultad de Educación (Universidad de los Andes). Muestra la oferta de
pregrado y posgrado del periodo 2026-2, con sus profesores.

## Stack

- **Next.js 15** (App Router) con dos grupos de rutas:
  - `src/app/(app)/` → sitio público (`/`, `/pregrado`, `/posgrado`, `/profes`)
  - `src/app/(payload)/` → panel admin de Payload (`/admin`)
- **Payload CMS v3** con adaptador **SQLite** (`@payloadcms/db-sqlite`)
- **Tailwind CSS**
- Desplegado en **Railway** (auto-deploy desde la rama `main` de GitHub)

## Cómo correr en local

```bash
npm install
cp seed.sqlite db.sqlite        # base de datos local con los datos reales
npm run dev                     # http://localhost:3000
```

Necesitas un archivo `.env` en la raíz (no está en git):

```
DATABASE_URI=file:./db.sqlite
PAYLOAD_SECRET=dev-secret-local-only-change-in-production
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

El panel admin entra sin contraseña en desarrollo (autoLogin). Credenciales por
defecto: `coordinador@faceduc.uniandes.edu.co` / `faceduc2026` (configurables con
`ADMIN_EMAIL` / `ADMIN_PASSWORD`).

## Colecciones (Payload)

- **Courses** (`src/collections/Courses.ts`) — curso. Campos clave:
  - `category`: `pregrado` | `posgrado`
  - `programType`: `LIC` | `MS` | `ESP` | `DOC`
  - `subProgram`: `profundizacion` | `investigacion` | `compartido` (solo MS;
    define en qué pestaña de maestría aparece)
  - `topics`: relación con **Categories** (etiquetas temáticas para filtrar)
  - `programRequirements`: lista `{ program, requirement }` con
    `requirement` = `obligatoria` | `electiva` por programa (texto libre)
  - `modality`: `PRESENCIAL` | `VIRTUAL` | `HÍBRIDA`
  - `professor`, `image`, `scheduleSlots`, `active`, etc.
- **Professors** (`src/collections/Professors.ts`)
- **Categories** (`src/collections/Categories.ts`) — etiquetas temáticas que el
  coordinador crea y administra. Se usan como filtros en el sitio.
- **Media** — imágenes. `staticDir` usa `MEDIA_DIR` (volumen en producción).
- **Users** — usuarios del admin.

## Lógica importante del frontend

- **Agrupación de cursos** (`src/lib/groupCourses.ts`): junta secciones (NRC)
  del mismo curso en una sola tarjeta.
- **Barra de filtros** (`src/components/CoursesGrid.tsx`): Modalidad
  (selección única) + Categorías (multi) + Tipo obligatoria/electiva. Cada fila
  solo aparece si hay datos. Se usa en pregrado y posgrado.
- **Pestañas de posgrado** (`src/components/PosgradoClient.tsx`): Maestría
  Profundización / Maestría Investigación / Especialización / Doctorado.
- **Obligatoria / Electiva por pestaña** (`src/lib/requirements.ts`): el
  indicador en la tarjeta de posgrado muestra el requisito que corresponde a la
  pestaña activa, cruzando el texto de `programRequirements[].program` (sin
  acentos). Reglas:
  - `"Todos los posgrados"` → aplica a todas las pestañas.
  - Texto con `"Profundización"` o `"Investigación"` → solo ese track.
  - `"Maestría"` genérica (sin nombrar un track) → ambas maestrías.
  - `"Especialización"` / `"Doctorado"` → sus pestañas.
  - Un curso aparece en **todas** las pestañas cuyo programa menciona.

## Despliegue (Railway)

- Auto-deploy al hacer `git push` a `main`.
- Config en `railway.toml`. El `startCommand`:
  - Pone la base de datos y las imágenes en el **volumen persistente**
    (`RAILWAY_VOLUME_MOUNT_PATH`, fallback `/tmp`), así los cambios del admin y
    las fotos sobreviven a los redeploys.
  - En el primer arranque copia `seed.sqlite` al volumen si no existe.
- **Migraciones**: en producción `NODE_ENV=production`, por lo que el esquema NO
  se autogenera (`push` solo corre en dev). Las migraciones en `src/migrations/`
  se ejecutan vía `prodMigrations` en `payload.config.ts`.

### Crear una migración (al cambiar el esquema de una colección)

```bash
NODE_OPTIONS="--no-deprecation --import tsx" npx payload migrate:create <nombre>
```

Esto la genera en `src/migrations/` y la registra en `src/migrations/index.ts`.
Conviene probarla contra una copia del seed antes de subir:

```bash
cp seed.sqlite /tmp/test.sqlite
DATABASE_URI="file:///tmp/test.sqlite" NODE_OPTIONS="--no-deprecation --import tsx" npx payload migrate
```

## Flujo de trabajo acordado

- **Probar en local antes de subir** a Railway.
- Verificar con el dev server (`npm run dev`) que las páginas cargan y que la
  funcionalidad nueva se ve bien.
- Solo hacer `git push` cuando se confirme.

## Pendientes

- [ ] **Revisar el Excel para corregir la modalidad**: los cursos que dicen
  "Campus" → `PRESENCIAL`; los que dicen "Virtual" → `VIRTUAL`. (Falta ubicar
  el archivo Excel fuente.)
- [ ] Rellenar descripciones de cursos y biografías de profesores faltantes
  desde el admin.
- [ ] Re-subir las fotos de cursos/profesores (las anteriores se perdieron al
  estar en disco efímero antes de configurar el volumen; las nuevas ya
  persisten).
- [ ] Crear categorías temáticas reales en el admin y asignarlas a los cursos.
