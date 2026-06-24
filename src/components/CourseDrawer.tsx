'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import type { CourseData, CourseSection } from './CourseCard'

type Props = {
  course: CourseData | null
  onClose: () => void
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-display text-xs font-black uppercase tracking-widest text-neutral-400">
        {label}
      </p>
      <p className="mt-0.5 font-mono text-sm leading-relaxed text-neutral-700">{value}</p>
    </div>
  )
}

function RichTextRenderer({ content }: { content: unknown }) {
  if (!content || typeof content !== 'object') return null
  const root = (content as { root?: { children?: unknown[] } }).root
  if (!root?.children) return null

  return (
    <div className="space-y-3">
      {root.children.map((node: unknown, i: number) => {
        const n = node as { type?: string; children?: unknown[] }
        if (n.type === 'paragraph') {
          if (!n.children || n.children.length === 0) return <br key={i} />
          return (
            <p key={i} className="font-mono text-sm leading-relaxed text-neutral-700">
              {n.children.map((child: unknown, j: number) => {
                const c = child as { text?: string; format?: number }
                if (c.format && c.format & 1) return <strong key={j} className="text-black">{c.text}</strong>
                if (c.format && c.format & 2) return <em key={j}>{c.text}</em>
                return <span key={j}>{c.text}</span>
              })}
            </p>
          )
        }
        return null
      })}
    </div>
  )
}

function SectionBlock({ section, index, total }: { section: CourseSection; index: number; total: number }) {
  return (
    <div className="flex flex-col gap-2">
      {/* Section header */}
      <div className="flex items-center gap-3">
        {total > 1 && (
          <span className="shrink-0 rounded-full bg-facu-green px-3 py-0.5 font-display text-xs font-black tracking-widest text-black">
            SECCIÓN {index + 1}
          </span>
        )}
        {section.nrc && (
          <span className="font-mono text-xs text-neutral-500">NRC {section.nrc}</span>
        )}
      </div>
      {/* Schedule slots */}
      {section.scheduleSlots && section.scheduleSlots.length > 0 && (
        <div className="flex flex-wrap gap-x-6 gap-y-2 pl-1">
          {section.scheduleSlots.map((slot, i) => (
            <div key={i}>
              <p className="font-display text-xs font-black uppercase tracking-widest text-facu-green">
                {slot.day}
              </p>
              <p className="font-mono text-sm text-black">
                {slot.startTime} – {slot.endTime}
              </p>
            </div>
          ))}
        </div>
      )}
      {/* Per-section professor */}
      {section.professor && (
        <p className="pl-1 font-mono text-xs text-neutral-600">
          {section.professor.name}{section.professor.rank ? ` · ${section.professor.rank}` : ''}
        </p>
      )}
    </div>
  )
}

export default function CourseDrawer({ course, onClose }: Props) {
  useEffect(() => {
    if (!course) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [course, onClose])

  if (!course) return null

  const imageUrl = course.image?.sizes?.card?.url ?? course.image?.url ?? null

  const metaPrimary = [
    course.code,
    course.weeks ? `${course.weeks} SEMANAS` : null,
    course.credits ? `${course.credits} CRD` : null,
  ].filter(Boolean)

  const metaSecondary = [
    course.modality,
  ].filter(Boolean)

  return (
    <>
      {/* Backdrop */}
      <div
        className="animate-fade fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        className="animate-slide-in fixed right-0 top-0 z-50 flex h-full w-full max-w-xl flex-col overflow-y-auto bg-white shadow-2xl"
      >
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between bg-white/80 px-5 py-4 backdrop-blur-md">
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-lg text-white transition-colors hover:bg-facu-green"
            aria-label="Cerrar"
          >
            ←
          </button>
          <span className="rounded-full bg-black px-4 py-1.5 font-display text-sm font-black tracking-wider text-white">
            {course.programType}
          </span>
        </div>

        {/* Image */}
        {imageUrl ? (
          <div className="relative -mt-[72px] aspect-[16/10] w-full">
            <Image
              src={imageUrl}
              alt={course.image?.alt ?? course.title}
              fill
              className="object-cover"
              sizes="600px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        ) : (
          <div className="h-4" />
        )}

        <div className="px-6 pb-10 pt-6">
          {/* Title */}
          <h2 className="font-display text-3xl font-black uppercase leading-tight tracking-wide">
            {course.title}
            {course.titleLine2 && (
              <>
                <br />
                {course.titleLine2}
              </>
            )}
          </h2>

          {/* Metadata */}
          {(metaPrimary.length > 0 || metaSecondary.length > 0) && (
            <div className="mt-3 space-y-0.5 font-mono text-xs uppercase tracking-wide text-neutral-500">
              {metaPrimary.length > 0 && <p>{metaPrimary.join('  |  ')}</p>}
              {metaSecondary.length > 0 && <p>{metaSecondary.join('  |  ')}</p>}
            </div>
          )}

          {/* Sections (NRC + schedule + professor) */}
          {course.sections && course.sections.length > 0 && (
            <div className="mt-5 space-y-4 border-y border-neutral-100 py-5">
              {course.sections.map((sec, si) => (
                <SectionBlock key={si} section={sec} index={si} total={course.sections.length} />
              ))}
            </div>
          )}

          {/* Not offered banner */}
          {!course.active && (
            <div className="mt-5 border-2 border-black px-4 py-3 text-center">
              <p className="font-mono text-sm font-bold tracking-wider">NO SE OFERTA EN 2026-2</p>
            </div>
          )}

          {/* Description */}
          {course.description ? (
            <div className="mt-6">
              <RichTextRenderer content={course.description} />
            </div>
          ) : null}

          {/* Program requirements (obligatoria / electiva) */}
          {course.programRequirements && course.programRequirements.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {course.programRequirements.map((pr, i) => (
                <span
                  key={i}
                  className={`rounded-full px-3 py-1 font-mono text-xs ${
                    pr.requirement === 'obligatoria'
                      ? 'bg-black text-white'
                      : 'bg-neutral-100 text-neutral-700 ring-1 ring-neutral-300'
                  }`}
                >
                  {pr.requirement === 'obligatoria' ? 'Obligatoria' : 'Electiva'} · {pr.program}
                </span>
              ))}
            </div>
          )}

          {/* Prerequisites / corequisites / observations */}
          {(course.prerequisites || course.corequisites || course.observations) && (
            <div className="mt-6 space-y-3 border-t border-neutral-100 pt-5">
              {course.prerequisites && (
                <InfoRow label="Prerrequisitos" value={course.prerequisites} />
              )}
              {course.corequisites && (
                <InfoRow label="Correquisitos" value={course.corequisites} />
              )}
              {course.observations && (
                <InfoRow label="Observaciones" value={course.observations} />
              )}
            </div>
          )}

          {/* Professor fallback (shown only if no sections or sections have no prof) */}

        </div>
      </div>
    </>
  )
}
