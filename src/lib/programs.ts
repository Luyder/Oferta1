export type ProgramGroup = {
  label: string
  programs: string[]
}

export const PROGRAM_GROUPS: ProgramGroup[] = [
  {
    label: 'General',
    programs: ['Todos los programas', 'Todos los pregrados', 'Todos los posgrados'],
  },
  {
    label: 'Pregrado — Licenciaturas',
    programs: [
      'Licenciatura en Artes',
      'Licenciatura en Biología',
      'Licenciatura en Educación Infantil',
      'Licenciatura en Español y Filología',
      'Licenciatura en Filosofía',
      'Licenciatura en Física',
      'Licenciatura en Historia',
      'Licenciatura en Matemáticas',
      'Licenciatura en Química',
      'Opción en Pedagogía',
    ],
  },
  {
    label: 'Especializaciones',
    programs: [
      'Especialización en Innovación Curricular y Pedagógica',
      'Especialización en Liderazgo y Política Educativa',
      'Especialización en Educación Matemática para Profesores de Primaria',
    ],
  },
  {
    label: 'Maestrías',
    programs: [
      'Maestría en Educación – Profundización (virtual)',
      'Maestría en Educación – Profundización (semipresencial)',
      'Maestría en Educación – Investigación (semipresencial)',
      'Maestría en Educación Matemática',
    ],
  },
  {
    label: 'Doctorado',
    programs: ['Doctorado en Educación'],
  },
]

// Flat list for Payload select field options
export const PROGRAM_OPTIONS = PROGRAM_GROUPS.flatMap((g) =>
  g.programs.map((p) => ({ label: p, value: p })),
)
