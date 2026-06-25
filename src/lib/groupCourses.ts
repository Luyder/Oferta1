import type { CourseData, CourseSection } from '@/components/CourseCard'

type RawDoc = {
  id: string | number
  title: string
  titleLine2?: string | null
  category: string
  programType: string
  code?: string | null
  credits?: number | null
  weeks?: number | null
  nrc?: string | null
  modality?: string | null
  scheduleSlots?: Array<{ day: string; startTime: string; endTime: string }> | null
  description?: unknown
  prerequisites?: string | null
  corequisites?: string | null
  observations?: string | null
  programRequirements?: Array<{ program: string; requirement: string }> | null
  active?: boolean | null
  subProgram?: string | null
  topics?: unknown
  professor?: unknown
  image?: unknown
  order?: number | null
}

function extractTopics(d: RawDoc): string[] {
  const t = d.topics
  if (!Array.isArray(t)) return []
  return t
    .map((item) => {
      if (item && typeof item === 'object' && 'name' in item) {
        return (item as { name?: string }).name ?? null
      }
      return null
    })
    .filter((x): x is string => Boolean(x))
}

function normTitle(t: string) {
  return t.trim().toUpperCase()
}

function extractProfessor(d: RawDoc): CourseSection['professor'] {
  const p = d.professor
  if (p && typeof p === 'object' && 'name' in p) {
    return {
      name: (p as { name: string }).name,
      rank: (p as { rank?: string }).rank ?? '',
    }
  }
  return null
}

function extractImage(d: RawDoc): CourseData['image'] {
  const img = d.image
  if (img && typeof img === 'object' && 'url' in img) {
    return {
      url: (img as { url?: string }).url ?? null,
      alt: (img as { alt?: string }).alt ?? null,
      sizes: (img as { sizes?: CourseData['image'] extends { sizes?: infer S } ? S : never }).sizes,
    }
  }
  return null
}

export function groupCourses(docs: RawDoc[]): CourseData[] {
  const seen = new Map<string, CourseData>()

  for (const d of docs) {
    const key = normTitle(d.title)
    const section: CourseSection = {
      nrc: d.nrc ?? null,
      scheduleSlots: (d.scheduleSlots as CourseSection['scheduleSlots']) ?? null,
      professor: extractProfessor(d),
    }

    if (seen.has(key)) {
      // Append section to existing course
      seen.get(key)!.sections.push(section)
    } else {
      seen.set(key, {
        id: d.id,
        title: d.title,
        titleLine2: d.titleLine2 ?? null,
        category: d.category as CourseData['category'],
        programType: d.programType as CourseData['programType'],
        code: d.code ?? null,
        credits: d.credits ?? null,
        weeks: d.weeks ?? null,
        modality: d.modality ?? null,
        description: (d.description as Record<string, unknown>) ?? null,
        prerequisites: d.prerequisites ?? null,
        corequisites: d.corequisites ?? null,
        observations: d.observations ?? null,
        programRequirements: (d.programRequirements as CourseData['programRequirements']) ?? null,
        active: d.active ?? true,
        subProgram: d.subProgram ?? null,
        topics: extractTopics(d),
        sections: [section],
        image: extractImage(d),
      })
    }
  }

  return Array.from(seen.values())
}
