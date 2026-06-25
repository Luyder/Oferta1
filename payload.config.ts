import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { es } from '@payloadcms/translations/languages/es'
import { fileURLToPath } from 'url'
import path from 'path'
import sharp from 'sharp'

import { Media } from './src/collections/Media'
import { Courses } from './src/collections/Courses'
import { Professors } from './src/collections/Professors'
import { Users } from './src/collections/Users'
import { migrations } from './src/migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '— Cursos FacEduc',
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      // Botón "Ver sitio público" en la barra lateral del admin.
      beforeNavLinks: ['/src/components/admin/ViewSiteLink#ViewSiteLink'],
    },
    // Acceso automático al panel: entra a /admin sin pedir contraseña.
    // ⚠️ Cualquiera con el enlace puede editar el contenido.
    autoLogin: {
      email: process.env.ADMIN_EMAIL ?? 'coordinador@faceduc.uniandes.edu.co',
      password: process.env.ADMIN_PASSWORD ?? 'faceduc2026',
      prefillOnly: false,
    },
  },
  collections: [Courses, Professors, Media, Users],
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI ?? `file:${path.resolve(dirname, 'db.sqlite')}`,
    },
    // Run migrations automatically on startup in production (creates tables).
    prodMigrations: migrations,
  }),
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET ?? 'super-secret-change-in-production',
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'src/payload-types.ts'),
  },
  upload: {
    limits: {
      fileSize: 10_000_000, // 10 MB
    },
  },
  i18n: {
    supportedLanguages: { es },
    fallbackLanguage: 'es',
  },
  // Crea el usuario de acceso automático si aún no existe (también en despliegues nuevos).
  onInit: async (payload) => {
    const email = process.env.ADMIN_EMAIL ?? 'coordinador@faceduc.uniandes.edu.co'
    const password = process.env.ADMIN_PASSWORD ?? 'faceduc2026'
    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
      limit: 1,
    })
    if (existing.totalDocs === 0) {
      await payload.create({
        collection: 'users',
        data: { email, password, name: 'Coordinador' },
      })
    }
  },
})
