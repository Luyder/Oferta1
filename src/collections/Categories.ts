import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Categoría', plural: 'Categorías' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'order'],
    description:
      'Etiquetas temáticas para filtrar cursos por interés (ej: Inclusión, Tecnología, Primera infancia). Se muestran como filtros en las páginas de cursos.',
  },
  access: { read: () => true },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nombre de la categoría',
    },
    {
      name: 'order',
      type: 'number',
      label: 'Orden de aparición',
      admin: {
        description: 'Las categorías con menor número aparecen primero en los filtros.',
      },
    },
  ],
}
