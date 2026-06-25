import type { CollectionConfig } from 'payload'

function normalize(str: string) {
  return str
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
}

export const Courses: CollectionConfig = {
  slug: 'courses',
  labels: { singular: 'Curso', plural: 'Cursos' },
  access: { read: () => true },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'programType', 'active'],
    listSearchableFields: ['title', 'titleNormalized', 'code'],
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data.title) {
          data.titleNormalized = normalize(data.title)
        }
        return data
      },
    ],
  },
  fields: [
    // --- Identificación ---
    {
      name: 'title',
      type: 'text',
      label: 'Nombre del curso',
      required: true,
    },
    {
      name: 'titleNormalized',
      type: 'text',
      admin: { hidden: true },
    },
    {
      name: 'titleLine2',
      type: 'text',
      label: 'Segunda línea del nombre (opcional)',
      admin: { description: 'Si el nombre tiene dos líneas, escribe la segunda aquí' },
    },
    {
      name: 'category',
      type: 'select',
      label: 'Categoría',
      required: true,
      options: [
        { label: 'Pregrado', value: 'pregrado' },
        { label: 'Posgrado', value: 'posgrado' },
      ],
    },
    {
      name: 'programType',
      type: 'select',
      label: 'Tipo de programa',
      required: true,
      options: [
        { label: 'LIC (Licenciatura)', value: 'LIC' },
        { label: 'MS (Maestría)', value: 'MS' },
        { label: 'ESP (Especialización)', value: 'ESP' },
        { label: 'DOC (Doctorado)', value: 'DOC' },
      ],
    },
    {
      name: 'subProgram',
      type: 'select',
      label: 'Track de maestría',
      admin: {
        description: 'Solo para cursos MS. Indica a qué track pertenece este curso.',
        condition: (data) => data?.programType === 'MS',
      },
      options: [
        { label: 'Profundización', value: 'profundizacion' },
        { label: 'Investigación', value: 'investigacion' },
        { label: 'Compartido (ambos tracks)', value: 'compartido' },
      ],
    },
    // --- Datos académicos ---
    {
      name: 'code',
      type: 'text',
      label: 'Código del curso (ej: EDUC-1100)',
    },
    {
      name: 'credits',
      type: 'number',
      label: 'Créditos',
      min: 0,
      max: 20,
    },
    {
      name: 'weeks',
      type: 'number',
      label: 'Semanas',
      defaultValue: 16,
    },
    {
      name: 'nrc',
      type: 'text',
      label: 'NRC',
    },
    {
      name: 'modality',
      type: 'select',
      label: 'Modalidad',
      options: [
        { label: 'Presencial', value: 'PRESENCIAL' },
        { label: 'Virtual', value: 'VIRTUAL' },
        { label: 'Híbrida', value: 'HÍBRIDA' },
      ],
      defaultValue: 'PRESENCIAL',
    },
    // --- Horario ---
    {
      name: 'scheduleSlots',
      type: 'array',
      label: 'Horario',
      labels: { singular: 'Bloque', plural: 'Bloques' },
      fields: [
        {
          name: 'day',
          type: 'select',
          label: 'Día',
          required: true,
          options: [
            { label: 'Lunes', value: 'LUNES' },
            { label: 'Martes', value: 'MARTES' },
            { label: 'Miércoles', value: 'MIÉRCOLES' },
            { label: 'Jueves', value: 'JUEVES' },
            { label: 'Viernes', value: 'VIERNES' },
            { label: 'Sábado', value: 'SÁBADO' },
          ],
        },
        {
          name: 'startTime',
          type: 'text',
          label: 'Hora inicio (ej: 9:00 AM)',
          required: true,
        },
        {
          name: 'endTime',
          type: 'text',
          label: 'Hora fin (ej: 10:50 AM)',
          required: true,
        },
      ],
    },
    // --- Contenido ---
    {
      name: 'description',
      type: 'richText',
      label: 'Descripción del curso',
    },
    // --- Requisitos ---
    {
      name: 'prerequisites',
      type: 'textarea',
      label: 'Prerrequisitos',
      admin: { description: 'Cursos o condiciones que deben cumplirse antes. Deja vacío si no aplica.' },
    },
    {
      name: 'corequisites',
      type: 'textarea',
      label: 'Correquisitos',
      admin: { description: 'Cursos que deben tomarse simultáneamente. Deja vacío si no aplica.' },
    },
    {
      name: 'observations',
      type: 'textarea',
      label: 'Observaciones / restricciones',
      admin: { description: 'Notas adicionales (ej: "Solo para estudiantes de cuarto semestre en adelante").' },
    },
    {
      name: 'programRequirements',
      type: 'array',
      label: 'Obligatoria / Electiva por programa',
      labels: { singular: 'Programa', plural: 'Programas' },
      admin: {
        description: 'Indica en qué programas el curso es obligatorio o electivo.',
      },
      fields: [
        {
          name: 'program',
          type: 'text',
          label: 'Programa',
          required: true,
          admin: { description: 'Ej: Maestría en Educación Investigación, Doctorado, Todos los posgrados…' },
        },
        {
          name: 'requirement',
          type: 'select',
          label: 'Tipo',
          required: true,
          options: [
            { label: 'Obligatoria', value: 'obligatoria' },
            { label: 'Electiva', value: 'electiva' },
          ],
        },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      label: 'Foto del curso',
      relationTo: 'media',
    },
    {
      name: 'professor',
      type: 'relationship',
      label: 'Profesor/a',
      relationTo: 'professors',
    },
    // --- Estado ---
    {
      name: 'active',
      type: 'checkbox',
      label: 'Se oferta en este período',
      defaultValue: true,
      admin: {
        description: 'Desmarca si el curso NO se oferta en 2026-1',
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Orden de aparición',
      defaultValue: 0,
      admin: { description: 'Número menor = aparece primero' },
    },
  ],
}
