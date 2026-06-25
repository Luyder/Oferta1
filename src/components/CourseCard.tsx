'use client'

import Image from 'next/image'

export type ScheduleSlot = { day: string; startTime: string; endTime: string }

export type CourseSection = {
  nrc?: string | null
  scheduleSlots?: ScheduleSlot[] | null
  professor?: { name: string; rank: string } | null
}

export type CourseData = {
  id: string | number
  title: string
  titleLine2?: string | null
  category: 'pregrado' | 'posgrado'
  programType: 'LIC' | 'MS' | 'ESP' | 'DOC'
  code?: string | null
  credits?: number | null
  weeks?: number | null
  modality?: string | null
  description?: Record<string, unknown> | null
  prerequisites?: string | null
  corequisites?: string | null
  observations?: string | null
  programRequirements?: Array<{ program: string; requirement: 'obligatoria' | 'electiva' }> | null
  active: boolean
  subProgram?: string | null
  /** Nombres de las categorías temáticas asignadas (para filtrar) */
  topics?: string[] | null
  /** Todas las secciones (NRC + horario + profesor) de este curso */
  sections: CourseSection[]
  image?: {
    url?: string | null
    alt?: string | null
    sizes?: { card?: { url?: string | null } }
  } | null
}

type Props = {
  course: CourseData
  onClick: (course: CourseData) => void
}

export default function CourseCard({ course, onClick }: Props) {
  const imageUrl = course.image?.sizes?.card?.url ?? course.image?.url ?? null
  const badgeLabel = course.category === 'pregrado' ? 'PREGRADO' : 'POSGRADO'

  return (
    <button
      onClick={() => onClick(course)}
      className="group flex w-full flex-col overflow-hidden rounded-2xl bg-white text-left shadow-[0_2px_12px_rgba(0,0,0,0.06)] ring-1 ring-black/5 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.14)] focus:outline-none focus-visible:ring-2 focus-visible:ring-facu-green"
    >
      {/* Green header */}
      <div className="flex min-h-[76px] items-start bg-facu-green px-5 py-4">
        <h3 className="font-display text-base font-black uppercase leading-tight tracking-wide text-black">
          {course.title}
          {course.titleLine2 && (
            <>
              <br />
              {course.titleLine2}
            </>
          )}
        </h3>
      </div>

      {/* Image area */}
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-200">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={course.image?.alt ?? course.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-200">
            <span className="font-mono text-xs text-neutral-400">Sin imagen</span>
          </div>
        )}

        {/* "No se oferta" overlay */}
        {!course.active && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/45 backdrop-blur-[1px]">
            <div className="border border-white/70 px-4 py-2 text-center">
              <p className="font-mono text-sm font-bold leading-snug tracking-wider text-white">
                NO SE OFERTA
                <br />
                EN 2026-2
              </p>
            </div>
          </div>
        )}

        {/* Badges */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
          {course.sections.length > 1 && (
            <span className="rounded-full bg-facu-green px-2.5 py-1 font-display text-[11px] font-bold tracking-wider text-black">
              {course.sections.length} secc.
            </span>
          )}
          <span className="rounded-full bg-black px-3 py-1 font-display text-[11px] font-bold tracking-wider text-white">
            {badgeLabel}
          </span>
        </div>
      </div>
    </button>
  )
}
