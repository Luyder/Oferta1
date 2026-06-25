import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Imagen', plural: 'Imágenes' },
  access: { read: () => true },
  upload: {
    // En producción (Railway) MEDIA_DIR apunta al volumen persistente
    // para que las fotos sobrevivan a los redeploys. En local usa public/media.
    staticDir: process.env.MEDIA_DIR || 'public/media',
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300 },
      { name: 'card', width: 800, height: 600 },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Texto alternativo',
    },
  ],
}
