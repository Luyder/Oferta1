import { getPayload } from 'payload'
import config from '../payload.config'
import fs from 'fs'
import path from 'path'

const BACKUP = path.resolve(process.cwd(), '../BACKUP-datos')

// Fields that Payload manages automatically — never set them on create.
const STRIP = ['id', 'createdAt', 'updatedAt', 'titleNormalized']

function clean<T extends Record<string, unknown>>(doc: T): Partial<T> {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(doc)) {
    if (STRIP.includes(k)) continue
    out[k] = v
  }
  return out as Partial<T>
}

async function main() {
  const payload = await getPayload({ config })

  const professors = JSON.parse(fs.readFileSync(path.join(BACKUP, 'professors.json'), 'utf8')).docs as any[]
  const courses = JSON.parse(fs.readFileSync(path.join(BACKUP, 'courses.json'), 'utf8')).docs as any[]

  // 1) Professors first — keep a map oldId -> newId for relationships.
  const profMap = new Map<number, number | string>()
  for (const p of professors) {
    const created = await payload.create({
      collection: 'professors',
      data: clean(p) as any,
    })
    profMap.set(p.id, created.id)
  }
  console.log(`Seeded ${profMap.size} professors`)

  // 2) Courses — remap professor reference through the map.
  let n = 0
  for (const c of courses) {
    const data = clean(c) as any
    if (c.professor != null) {
      const mapped = profMap.get(typeof c.professor === 'object' ? c.professor.id : c.professor)
      data.professor = mapped ?? null
    }
    // image was always null (no uploads) — drop it to be safe.
    delete data.image
    await payload.create({ collection: 'courses', data })
    n++
  }
  console.log(`Seeded ${n} courses`)

  console.log('DONE')
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
