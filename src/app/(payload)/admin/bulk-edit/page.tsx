import { getPayload } from 'payload'
import config from '@payload-config'
import BulkEditClient, { type CourseGroup } from '@/components/admin/BulkEditClient'

export const dynamic = 'force-dynamic'

function normalize(s: string) {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
}

export default async function BulkEditPage() {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'courses',
    limit: 500,
    depth: 1,
  })

  // Group by titleNormalized
  const groupMap = new Map<string, CourseGroup>()

  for (const doc of docs) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const d = doc as any
    const tn: string = d.titleNormalized || normalize(d.title || '')
    if (!groupMap.has(tn)) {
      const img = d.image && typeof d.image === 'object' ? d.image : null
      groupMap.set(tn, {
        titleNormalized: tn,
        title: d.title ?? '',
        count: 1,
        programType: d.programType ?? '',
        subProgram: d.subProgram ?? null,
        obligatoriaEn: (d.obligatoriaEn as string[]) ?? [],
        electivaEn: (d.electivaEn as string[]) ?? [],
        imageId: img?.id ?? null,
        imageUrl: img?.sizes?.card?.url ?? img?.url ?? null,
      })
    } else {
      groupMap.get(tn)!.count++
    }
  }

  const groups = Array.from(groupMap.values())
    .filter((g) => g.count > 1)
    .sort((a, b) => a.title.localeCompare(b.title, 'es'))

  return <BulkEditClient groups={groups} />
}
