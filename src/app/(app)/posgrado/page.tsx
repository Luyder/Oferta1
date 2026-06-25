import { getPayload } from 'payload'
import config from '@payload-config'
import PageHeader from '@/components/PageHeader'
import CoursesGrid from '@/components/CoursesGrid'
import { groupCourses } from '@/lib/groupCourses'
import type { CourseData } from '@/components/CourseCard'

export const dynamic = 'force-dynamic'

type RawCourse = {
  subProgram?: string | null
  [key: string]: unknown
}

export default async function PosgradoPage() {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'courses',
    where: { category: { equals: 'posgrado' } },
    sort: 'order',
    limit: 200,
    depth: 2,
  })

  const all = groupCourses(docs as any[])

  // Split MS courses by subProgram; other programTypes stay together
  const msProf    = all.filter(c => c.programType === 'MS' && (c as any).subProgram === 'profundizacion')
  const msInv     = all.filter(c => c.programType === 'MS' && (c as any).subProgram === 'investigacion')
  const msShared  = all.filter(c => c.programType === 'MS' && !(c as any).subProgram || c.programType === 'MS' && (c as any).subProgram === 'compartido')
  const esp       = all.filter(c => c.programType === 'ESP')
  const doc       = all.filter(c => c.programType === 'DOC')

  const hasMSTracks = msProf.length > 0 || msInv.length > 0

  return (
    <div className="min-h-screen bg-white">
      <PageHeader activeTab="posgrado" />
      <div className="mx-auto max-w-6xl px-6 py-10">

        {/* === MAESTRÍA === */}
        {hasMSTracks ? (
          <>
            {/* Profundización */}
            {msProf.length > 0 && (
              <Section
                title="Maestría en Educación"
                subtitle="Profundización"
                accent="bg-facu-green"
                courses={msProf}
              />
            )}

            {/* Investigación */}
            {msInv.length > 0 && (
              <Section
                title="Maestría en Educación"
                subtitle="Investigación"
                accent="bg-black"
                courses={msInv}
                dark
              />
            )}

            {/* Compartidos / sin etiquetar */}
            {msShared.length > 0 && (
              <Section
                title="Maestría en Educación"
                subtitle="Cursos compartidos"
                accent="bg-neutral-300"
                courses={msShared}
              />
            )}
          </>
        ) : (
          /* Fallback: show all MS together if none tagged yet */
          all.filter(c => c.programType === 'MS').length > 0 && (
            <Section
              title="Maestría en Educación"
              subtitle={`${all.filter(c => c.programType === 'MS').length} cursos`}
              accent="bg-facu-green"
              courses={all.filter(c => c.programType === 'MS')}
            />
          )
        )}

        {/* === ESPECIALIZACIÓN === */}
        {esp.length > 0 && (
          <Section
            title="Especialización"
            subtitle={`${esp.length} cursos`}
            accent="bg-facu-green"
            courses={esp}
          />
        )}

        {/* === DOCTORADO === */}
        {doc.length > 0 && (
          <Section
            title="Doctorado en Educación"
            subtitle={`${doc.length} cursos`}
            accent="bg-black"
            courses={doc}
            dark
          />
        )}

        {all.length === 0 && <EmptyState />}
      </div>
    </div>
  )
}

function Section({
  title,
  subtitle,
  accent,
  courses,
  dark = false,
}: {
  title: string
  subtitle: string
  accent: string
  courses: CourseData[]
  dark?: boolean
}) {
  return (
    <div className="mb-14">
      <div className="mb-6 flex items-end gap-4">
        <div className={`h-8 w-1.5 rounded-full ${accent}`} />
        <div>
          <h2 className="font-display text-2xl font-black tracking-tight leading-none">{title}</h2>
          <p className={`mt-1 font-mono text-xs uppercase tracking-widest ${dark ? 'text-black font-bold' : 'text-neutral-400'}`}>
            {subtitle} · {courses.length} {courses.length === 1 ? 'curso' : 'cursos'}
          </p>
        </div>
      </div>
      <CoursesGrid courses={courses} />
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
