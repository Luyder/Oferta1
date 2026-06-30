export type Requirement = 'obligatoria' | 'electiva'

const KNOWN_TRACKS = ['profundizacion', 'investigacion', 'esp', 'doc']

function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
}

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
 * Returns which requirement types apply to the given tab.
 * Uses two separate lists: programs where the course is obligatoria / electiva.
 */
export function requirementsForTrack(
  obligatoriaEn: string[] | null | undefined,
  electivaEn: string[] | null | undefined,
  track?: string,
): Requirement[] {
  const oblig = obligatoriaEn ?? []
  const elect = electivaEn ?? []

  if (!track || !KNOWN_TRACKS.includes(track)) {
    const result: Requirement[] = []
    if (oblig.length > 0) result.push('obligatoria')
    if (elect.length > 0) result.push('electiva')
    return result
  }

  const result: Requirement[] = []
  if (oblig.some((p) => matchesTrack(normalize(p), track))) result.push('obligatoria')
  if (elect.some((p) => matchesTrack(normalize(p), track))) result.push('electiva')
  return result
}

/**
 * Returns true if the course belongs to the given tab based on its program lists.
 */
export function belongsToTrackByRequirements(
  obligatoriaEn: string[] | null | undefined,
  electivaEn: string[] | null | undefined,
  track: string,
): boolean {
  return requirementsForTrack(obligatoriaEn, electivaEn, track).length > 0
}
