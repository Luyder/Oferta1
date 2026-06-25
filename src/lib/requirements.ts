export type Requirement = 'obligatoria' | 'electiva'

export type ProgramRequirement = { program: string; requirement: Requirement }

/**
 * Palabra clave (sin acentos, minúsculas) que identifica a qué programa
 * pertenece cada pestaña de posgrado, para cruzarla con el texto libre del
 * campo `programRequirements[].program`.
 */
const TRACK_KEYWORDS: Record<string, string> = {
  profundizacion: 'profundiz',
  investigacion: 'investigaci',
  esp: 'especializ',
  doc: 'doctorado',
}

function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
}

/**
 * Devuelve el/los requisito(s) (obligatoria/electiva) que aplican al programa
 * de la pestaña indicada. Si no se da una pestaña conocida, devuelve el conjunto
 * de requisitos distintos (todos). Un programa que diga "Todos los posgrados"
 * aplica a cualquier pestaña.
 */
export function requirementsForTrack(
  programRequirements: ProgramRequirement[] | null | undefined,
  track?: string,
): Requirement[] {
  const prs = programRequirements ?? []
  if (prs.length === 0) return []

  const keyword = track ? TRACK_KEYWORDS[track] : undefined
  if (!keyword) {
    return Array.from(new Set(prs.map((p) => p.requirement)))
  }

  const matched = prs.filter((p) => {
    const prog = normalize(p.program)
    return prog.includes(keyword) || prog.includes('todos')
  })
  return Array.from(new Set(matched.map((p) => p.requirement)))
}

/**
 * ¿Este curso corresponde a la pestaña indicada según su `programRequirements`?
 * (Se usa además del campo manual `subProgram` para incluir un curso en todos
 * los programas donde aparece, ej: obligatoria en Investigación + electiva en
 * Profundización → aparece en ambas pestañas.)
 */
export function belongsToTrackByRequirements(
  programRequirements: ProgramRequirement[] | null | undefined,
  track: string,
): boolean {
  return requirementsForTrack(programRequirements, track).length > 0
}
