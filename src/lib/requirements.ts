export type Requirement = 'obligatoria' | 'electiva'

export type ProgramRequirement = { program: string; requirement: Requirement }

const KNOWN_TRACKS = ['profundizacion', 'investigacion', 'esp', 'doc']

function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
}

/**
 * ¿El texto del programa (normalizado) corresponde a la pestaña indicada?
 *
 * Reglas:
 * - "Todos los posgrados" → aplica a cualquier pestaña.
 * - Maestría Profundización / Investigación: coincide si el texto nombra ese
 *   track explícitamente, O si menciona "maestría" de forma genérica (sin
 *   nombrar el otro track). Así una "Maestría para Concentración en ..." (sin
 *   decir Prof ni Inv) cuenta como electiva/obligatoria en ambas maestrías.
 * - Especialización / Doctorado: coincide si el texto los nombra.
 */
function matchesTrack(programNorm: string, track: string): boolean {
  if (programNorm.includes('todos')) return true

  switch (track) {
    case 'profundizacion':
      if (programNorm.includes('profundiz')) return true
      return programNorm.includes('maestria') && !programNorm.includes('investigaci')
    case 'investigacion':
      if (programNorm.includes('investigaci')) return true
      return programNorm.includes('maestria') && !programNorm.includes('profundiz')
    case 'esp':
      return programNorm.includes('especializ')
    case 'doc':
      return programNorm.includes('doctorado')
    default:
      return false
  }
}

/**
 * Devuelve el/los requisito(s) (obligatoria/electiva) que aplican al programa
 * de la pestaña indicada. Si no se da una pestaña conocida, devuelve el conjunto
 * de requisitos distintos (todos).
 */
export function requirementsForTrack(
  programRequirements: ProgramRequirement[] | null | undefined,
  track?: string,
): Requirement[] {
  const prs = programRequirements ?? []
  if (prs.length === 0) return []

  if (!track || !KNOWN_TRACKS.includes(track)) {
    return Array.from(new Set(prs.map((p) => p.requirement)))
  }

  const matched = prs.filter((p) => matchesTrack(normalize(p.program), track))
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
