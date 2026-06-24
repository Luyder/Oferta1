'use client'

import { useEffect } from 'react'
import Image from 'next/image'

export type ProfessorData = {
  id: string | number
  name: string
  rank?: string | null
  bio?: Record<string, unknown> | null
  photo?: { url?: string | null; alt?: string | null } | null
  courses: Array<{ id: string | number; title: string; code?: string | null; category: string; programType: string }>
}

type Props = {
  professor: ProfessorData | null
  onClose: () => void
}

function RichTextRenderer({ content }: { content: Record<string, unknown> | null | undefined }) {
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

export default function ProfessorDrawer({ professor, onClose }: Props) {
  useEffect(() => {
    if (!professor) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [professor, onClose])

  if (!professor) return null

  const pregrado = professor.courses.filter(c => c.category === 'pregrado')
  const posgrado = professor.courses.filter(c => c.category === 'posgrado')

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
            className="flex h-10 w-10 items-center justify-center rounded-full bg-facu-green text-lg text-black transition-colors hover:bg-black hover:text-white"
            aria-label="Cerrar"
          >
            ←
          </button>
          {professor.rank && (
            <span className="rounded-full bg-facu-green px-4 py-1.5 font-display text-sm font-black tracking-wider text-black">
              {professor.rank}
            </span>
          )}
        </div>

        {/* Photo */}
        {professor.photo?.url ? (
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-200">
            <Image
              src={professor.photo.url}
              alt={professor.photo.alt ?? professor.name}
              fill
              className="object-cover object-top"
              sizes="600px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        ) : (
          <div className="flex h-48 items-center justify-center bg-facu-green">
            <span className="font-display text-8xl font-black text-black/20">
              {professor.name.split(' ').slice(0, 2).map(w => w[0]).join('')}
            </span>
          </div>
        )}

        <div className="px-6 pb-10 pt-6">
          {/* Name */}
          <h2 className="font-display text-3xl font-black uppercase leading-tight tracking-wide">
            {professor.name}
          </h2>

          {/* Bio */}
          {professor.bio && (
            <div className="mt-5 border-t border-neutral-100 pt-5">
              <RichTextRenderer content={professor.bio} />
            </div>
          )}

          {/* Courses */}
          {professor.courses.length > 0 && (
            <div className="mt-8">
              <p className="mb-4 font-display text-xs font-black uppercase tracking-widest text-neutral-400">
                Cursos que dicta
              </p>
              {pregrado.length > 0 && (
                <div className="mb-4">
                  <p className="mb-2 font-mono text-xs uppercase tracking-widest text-neutral-400">Pregrado</p>
                  <div className="flex flex-col gap-2">
                    {pregrado.map(c => (
                      <div key={c.id} className="flex items-start gap-3 rounded-xl bg-neutral-50 px-4 py-3">
                        <span className="mt-0.5 shrink-0 rounded-full bg-facu-green px-2 py-0.5 font-display text-[10px] font-black tracking-widest text-black">
                          {c.programType}
                        </span>
                        <p className="font-display text-sm font-bold leading-snug text-black">{c.title}</p>
                        {c.code && <span className="ml-auto shrink-0 font-mono text-xs text-neutral-400">{c.code}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {posgrado.length > 0 && (
                <div>
                  <p className="mb-2 font-mono text-xs uppercase tracking-widest text-neutral-400">Posgrado</p>
                  <div className="flex flex-col gap-2">
                    {posgrado.map(c => (
                      <div key={c.id} className="flex items-start gap-3 rounded-xl bg-neutral-50 px-4 py-3">
                        <span className="mt-0.5 shrink-0 rounded-full bg-black px-2 py-0.5 font-display text-[10px] font-black tracking-widest text-white">
                          {c.programType}
                        </span>
                        <p className="font-display text-sm font-bold leading-snug text-black">{c.title}</p>
                        {c.code && <span className="ml-auto shrink-0 font-mono text-xs text-neutral-400">{c.code}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
