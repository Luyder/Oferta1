import type { CollectionConfig } from 'payload'

export const Feedback: CollectionConfig = {
  slug: 'feedback',
  labels: { singular: 'Comentario', plural: 'Comentarios' },
  admin: {
    useAsTitle: 'message',
    defaultColumns: ['message', 'page', 'createdAt'],
    description:
      'Comentarios y sugerencias que dejan los estudiantes desde el sitio público (¿Falta algo o hay algo incorrecto?).',
    group: 'Sitio',
  },
  access: {
    // Cualquiera puede enviar un comentario desde el sitio; solo el admin lo lee.
    create: () => true,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'message',
      type: 'textarea',
      required: true,
      label: 'Comentario',
    },
    {
      name: 'page',
      type: 'text',
      label: 'Página',
      admin: {
        description: 'Ruta desde la que se envió el comentario.',
        readOnly: true,
      },
    },
    {
      name: 'contact',
      type: 'text',
      label: 'Contacto (opcional)',
      admin: {
        description: 'Correo o nombre que dejó quien comentó, si lo dio.',
        readOnly: true,
      },
    },
  ],
}
