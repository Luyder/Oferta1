import { getPayload } from 'payload'
import config from '@payload-config'
import PageHeader from '@/components/PageHeader'
import CoursesGrid from '@/components/CoursesGrid'
import { groupCourses } from '@/lib/groupCourses'

export const dynamic = 'force-dynamic'

export default async function PregradoPage() {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'courses',
    where: { category: { equals: 'pregrado' }, active: { not_equals: false } },
    sort: 'order',
    limit: 200,
    depth: 2,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const courses = groupCourses(docs as any[])

  return (
    <div className="min-h-screen bg-white">
      <PageHeader activeTab="pregrado" />
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h2 className="font-display text-2xl font-black tracking-tight">Pregrado</h2>
          <p className="font-mono text-xs uppercase tracking-widest text-neutral-400">
            {courses.length} {courses.length === 1 ? 'curso' : 'cursos'} · 2026-2
          </p>
        </div>
        {courses.length === 0 ? (
          <EmptyState />
        ) : (
          <CoursesGrid courses={courses} />
        )}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-neutral-300 p-10 text-center">
      <p className="font-mono text-sm text-neutral-500">No hay cursos cargados aún.</p>
      <a
        href="/admin"
        className="mt-3 inline-block rounded-full bg-black px-5 py-2 font-display text-sm font-bold text-white transition-colors hover:bg-facu-green"
      >
        Agregar cursos en el panel admin →
      </a>
    </div>
  )
}
