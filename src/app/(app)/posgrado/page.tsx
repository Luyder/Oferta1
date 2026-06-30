import { getPayload } from 'payload'
import config from '@payload-config'
import PageHeader from '@/components/PageHeader'
import PosgradoClient from '@/components/PosgradoClient'
import { groupCourses } from '@/lib/groupCourses'
import { belongsToTrackByRequirements } from '@/lib/requirements'

export const dynamic = 'force-dynamic'

export default async function PosgradoPage() {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'courses',
    where: { category: { equals: 'posgrado' }, active: { not_equals: false } },
    sort: 'order',
    limit: 200,
    depth: 2,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const all = groupCourses(docs as any[])

  // Un curso MS pertenece a una pestaña según esta prioridad:
  // 1. Si tiene `subProgram` explícito → úsalo directamente.
  // 2. Si no tiene `subProgram` pero tiene `programRequirements` → el matching
  //    de texto determina en qué pestaña aparece (puede ser una o ambas).
  // 3. Sin ninguno de los dos → aparece en ambas maestrías (curso genérico).
  const allMS = all.filter(c => c.programType === 'MS')
  const inMaestria = (c: typeof all[number], trackKey: string, subVals: string[]) => {
    const sp = (c as any).subProgram
    if (sp) return subVals.includes(sp)
    const hasReqs = (c.obligatoriaEn?.length ?? 0) + (c.electivaEn?.length ?? 0) > 0
    if (hasReqs) return belongsToTrackByRequirements(c.obligatoriaEn, c.electivaEn, trackKey)
    return true
  }
  const msProf = allMS.filter(c => inMaestria(c, 'profundizacion', ['profundizacion', 'compartido']))
  const msInv  = allMS.filter(c => inMaestria(c, 'investigacion', ['investigacion', 'compartido']))
  const esp    = all.filter(c => c.programType === 'ESP' || belongsToTrackByRequirements(c.obligatoriaEn, c.electivaEn, 'esp'))
  const doc    = all.filter(c => c.programType === 'DOC' || belongsToTrackByRequirements(c.obligatoriaEn, c.electivaEn, 'doc'))

  type Section = { key: string; label: string; sublabel?: string; courses: typeof all; accent: string; dark: boolean }
  const sections: Section[] = ([
    msProf.length > 0 && {
      key: 'profundizacion',
      label: 'Maestría',
      sublabel: 'Profundización',
      courses: msProf,
      accent: 'bg-facu-green',
      dark: false,
    },
    msInv.length > 0 && {
      key: 'investigacion',
      label: 'Maestría',
      sublabel: 'Investigación',
      courses: msInv,
      accent: 'bg-black',
      dark: true,
    },
    // Fallback: if no MS courses are tagged yet, show them all together
    msProf.length === 0 && msInv.length === 0 && all.filter(c => c.programType === 'MS').length > 0 && {
      key: 'ms',
      label: 'Maestría',
      courses: all.filter(c => c.programType === 'MS'),
      accent: 'bg-facu-green',
      dark: false,
    },
    esp.length > 0 && {
      key: 'esp',
      label: 'Especialización',
      courses: esp,
      accent: 'bg-facu-green',
      dark: false,
    },
    doc.length > 0 && {
      key: 'doc',
      label: 'Doctorado',
      courses: doc,
      accent: 'bg-black',
      dark: true,
    },
  ] as (Section | false)[]).filter(Boolean) as Section[]

  return (
    <div className="min-h-screen bg-white">
      <PageHeader activeTab="posgrado" />
      <div className="mx-auto max-w-6xl px-6 py-10">
        {all.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 p-10 text-center">
            <p className="font-mono text-sm text-neutral-500">No hay cursos cargados aún.</p>
            <a href="/admin" className="mt-3 inline-block rounded-full bg-black px-5 py-2 font-display text-sm font-bold text-white transition-colors hover:bg-facu-green">
              Agregar cursos en el panel admin →
            </a>
          </div>
        ) : (
          <PosgradoClient sections={sections} />
        )}
      </div>
    </div>
  )
}
