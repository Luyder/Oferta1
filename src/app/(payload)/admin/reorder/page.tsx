import { getPayload } from 'payload'
import config from '@payload-config'
import ReorderClient, { type ReorderCourse, type ReorderSection } from '@/components/admin/ReorderClient'
import { belongsToTrackByRequirements } from '@/lib/requirements'

export const dynamic = 'force-dynamic'

function normalize(s: string) {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
}

export default async function ReorderPage() {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'courses',
    sort: 'order',
    limit: 500,
    depth: 0,
  })

  const map = new Map<string, ReorderCourse>()

  for (const doc of docs) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const d = doc as any
    const tn: string = d.titleNormalized || normalize(d.title || '')
    if (!map.has(tn)) {
      map.set(tn, {
        titleNormalized: tn,
        title: d.title ?? '',
        category: d.category ?? '',
        programType: d.programType ?? '',
        subProgram: d.subProgram ?? null,
        obligatoriaEn: (d.obligatoriaEn as string[]) ?? [],
        electivaEn: (d.electivaEn as string[]) ?? [],
        active: d.active ?? true,
        count: 1,
      })
    } else {
      map.get(tn)!.count++
    }
  }

  const all = Array.from(map.values())

  const pregrado = all.filter((c) => c.category === 'pregrado')
  const allMS = all.filter((c) => c.programType === 'MS')

  const inMaestria = (c: ReorderCourse, trackKey: string, subVals: string[]) => {
    if (c.subProgram) return subVals.includes(c.subProgram)
    const hasReqs = (c.obligatoriaEn?.length ?? 0) + (c.electivaEn?.length ?? 0) > 0
    if (hasReqs) return belongsToTrackByRequirements(c.obligatoriaEn, c.electivaEn, trackKey)
    return true
  }

  const msProf = allMS.filter((c) => inMaestria(c, 'profundizacion', ['profundizacion', 'compartido']))
  const msInv = allMS.filter((c) => inMaestria(c, 'investigacion', ['investigacion', 'compartido']))
  const esp = all.filter((c) => c.programType === 'ESP' || belongsToTrackByRequirements(c.obligatoriaEn, c.electivaEn, 'esp'))
  const doc = all.filter((c) => c.programType === 'DOC' || belongsToTrackByRequirements(c.obligatoriaEn, c.electivaEn, 'doc'))

  const sections: ReorderSection[] = (
    [
      { key: 'pregrado', label: 'Pregrado', courses: pregrado },
      { key: 'profundizacion', label: 'Maestría · Profundización', courses: msProf },
      { key: 'investigacion', label: 'Maestría · Investigación', courses: msInv },
      { key: 'esp', label: 'Especialización', courses: esp },
      { key: 'doc', label: 'Doctorado', courses: doc },
    ] as ReorderSection[]
  ).filter((s) => s.courses.length > 0)

  return <ReorderClient sections={sections} />
}
