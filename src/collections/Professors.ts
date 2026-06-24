import type { CollectionConfig } from 'payload'

export const Professors: CollectionConfig = {
  slug: 'professors',
  labels: { singular: 'Profesor/a', plural: 'Profesores' },
  access: { read: () => true },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'rank'] },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nombre completo',
      required: true,
    },
    {
      name: 'rank',
      type: 'text',
      label: 'Rango / Cargo',
      admin: { description: 'Ej: Profesor Titular, Investigadora, Docente de cátedra…' },
    },
    {
      name: 'bio',
      type: 'richText',
      label: 'Biografía / Descripción',
      admin: { description: 'Breve presentación del/la profesor/a.' },
    },
    {
      name: 'photo',
      type: 'upload',
      label: 'Foto',
      relationTo: 'media',
    },
  ],
}
