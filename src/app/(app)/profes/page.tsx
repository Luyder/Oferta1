import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import ProfessorsGrid from '@/components/ProfessorsGrid'
import type { ProfessorData } from '@/components/ProfessorDrawer'

export const dynamic = 'force-dynamic'

export default async function ProfesPage() {
  const payload = await getPayload({ config })

  const [{ docs: profDocs }, { docs: courseDocs }] = await Promise.all([
    payload.find({ collection: 'professors', sort: 'name', limit: 200, depth: 1 }),
    payload.find({ collection: 'courses', limit: 300, depth: 0 }),
  ])

  // Build a map: professorId → list of courses (deduplicated by title)
  const coursesByProf = new Map<string, Map<string, ProfessorData['courses'][0]>>()
  for (const course of courseDocs) {
    if (!course.professor) continue
    const profId = String(typeof course.professor === 'object' ? (course.professor as { id: unknown }).id : course.professor)
    if (!coursesByProf.has(profId)) coursesByProf.set(profId, new Map())
    const titleKey = course.title.trim().toUpperCase()
    if (!coursesByProf.get(profId)!.has(titleKey)) {
      coursesByProf.get(profId)!.set(titleKey, {
        id: course.id,
        title: course.title,
        code: course.code ?? null,
        category: course.category,
        programType: course.programType,
      })
    }
  }

  const professors: ProfessorData[] = profDocs.map((prof) => {
    const photo = prof.photo && typeof prof.photo === 'object' && 'url' in prof.photo
      ? { url: (prof.photo as { url?: string }).url ?? null, alt: (prof.photo as { alt?: string }).alt ?? null }
      : null

    const courses = Array.from(coursesByProf.get(String(prof.id))?.values() ?? [])

    return {
      id: prof.id,
      name: prof.name,
      rank: prof.rank ?? null,
      bio: prof.bio ?? null,
      photo,
      courses,
    }
  })

  return (
    <div className="min-h-screen bg-facu-green">
      {/* Sticky header */}
      <header className="sticky top-0 z-30 bg-facu-green/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="group">
            <h1 className="font-display text-4xl font-black leading-none tracking-tight text-black">
              Profes
            </h1>
            <p className="font-display text-base font-medium text-black/70">de la Facu</p>
          </Link>
          <Link
            href="/pregrado"
            className="rounded-full bg-black px-5 py-2.5 font-display text-sm font-black tracking-widest text-white transition-colors hover:bg-white hover:text-black"
          >
            CURSOS
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 pb-16 pt-4">
        {professors.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-black/30 p-10 text-center">
            <p className="font-mono text-sm text-black/70">No hay profesores cargados aún.</p>
            <a
              href="/admin"
              className="mt-3 inline-block rounded-full bg-black px-5 py-2 font-display text-sm font-bold text-white"
            >
              Agregar en el panel admin →
            </a>
          </div>
        ) : (
          <ProfessorsGrid professors={professors} />
        )}
      </div>
    </div>
  )
}
