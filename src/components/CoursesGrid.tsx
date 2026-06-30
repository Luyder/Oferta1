'use client'

import { useMemo, useState } from 'react'
import CourseCard, { type CourseData } from './CourseCard'
import CourseDrawer from './CourseDrawer'
import { requirementsForTrack } from '@/lib/requirements'

type Props = {
  courses: CourseData[]
  /** Oculta la barra de filtros (modalidad + categorías). Por defecto se muestra. */
  showFilters?: boolean
  /** Pestaña activa de posgrado (profundizacion/investigacion/esp/doc), para
      resolver obligatoria/electiva según el programa correspondiente. */
  track?: string
}

const REQUIREMENT_LABELS: Record<string, string> = {
  obligatoria: 'Obligatoria',
  electiva: 'Electiva',
}

const MODALITY_LABELS: Record<string, string> = {
  PRESENCIAL: 'Presencial',
  VIRTUAL: 'Virtual',
  HÍBRIDA: 'Hyflex - Híbrida',
}

function normalize(s: string) {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
}

export default function CoursesGrid({ courses, showFilters = true, track }: Props) {
  const [selected, setSelected] = useState<CourseData | null>(null)
  const [query, setQuery] = useState<string>('')
  const [modality, setModality] = useState<string>('all')
  const [activeTopics, setActiveTopics] = useState<string[]>([])
  const [requirement, setRequirement] = useState<string>('all')

  // Modalidades y categorías disponibles según los cursos presentes.
  const modalities = useMemo(() => {
    const set = new Set<string>()
    for (const c of courses) if (c.modality) set.add(c.modality)
    return Array.from(set)
  }, [courses])

  const topics = useMemo(() => {
    const set = new Set<string>()
    for (const c of courses) for (const t of c.topics ?? []) set.add(t)
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'es'))
  }, [courses])

  // Obligatoria / electiva disponibles para la pestaña activa.
  const requirements = useMemo(() => {
    const set = new Set<string>()
    for (const c of courses) {
      for (const r of requirementsForTrack(c.obligatoriaEn, c.electivaEn, track)) {
        set.add(r)
      }
    }
    return ['obligatoria', 'electiva'].filter((r) => set.has(r))
  }, [courses, track])

  const toggleTopic = (t: string) =>
    setActiveTopics((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    )

  const q = normalize(query)
  const filtered = courses.filter((c) => {
    if (q && !normalize(c.title ?? '').includes(q)) return false
    if (modality !== 'all' && c.modality !== modality) return false
    if (activeTopics.length > 0) {
      const ct = c.topics ?? []
      if (!activeTopics.some((t) => ct.includes(t))) return false
    }
    if (requirement !== 'all') {
      const reqs = requirementsForTrack(c.obligatoriaEn, c.electivaEn, track)
      if (!reqs.includes(requirement as 'obligatoria' | 'electiva')) return false
    }
    return true
  })

  const hasFilters =
    showFilters &&
    (modalities.length > 0 || topics.length > 0 || requirements.length > 0)
  const anyActive =
    modality !== 'all' || activeTopics.length > 0 || requirement !== 'all'

  return (
    <>
      <div className="relative mb-6">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-sm text-neutral-400"
        >
          ⌕
        </span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar curso por nombre…"
          className="w-full rounded-full border border-neutral-300 bg-white py-3 pl-10 pr-4 font-display text-base text-black placeholder:text-neutral-400 focus:border-black focus:outline-none"
        />
      </div>

      {hasFilters && (
        <div className="mb-8 space-y-3">
          {modalities.length > 0 && (
            <FilterRow label="Modalidad">
              <Chip
                label="Todas"
                active={modality === 'all'}
                onClick={() => setModality('all')}
              />
              {modalities.map((m) => (
                <Chip
                  key={m}
                  label={MODALITY_LABELS[m] ?? m}
                  active={modality === m}
                  onClick={() => setModality(modality === m ? 'all' : m)}
                />
              ))}
            </FilterRow>
          )}

          {topics.length > 0 && (
            <FilterRow label="Categorías">
              {topics.map((t) => (
                <Chip
                  key={t}
                  label={t}
                  active={activeTopics.includes(t)}
                  onClick={() => toggleTopic(t)}
                />
              ))}
            </FilterRow>
          )}

          {requirements.length > 0 && (
            <FilterRow label="Tipo">
              <Chip
                label="Todos"
                active={requirement === 'all'}
                onClick={() => setRequirement('all')}
              />
              {requirements.map((r) => (
                <Chip
                  key={r}
                  label={REQUIREMENT_LABELS[r] ?? r}
                  active={requirement === r}
                  onClick={() => setRequirement(requirement === r ? 'all' : r)}
                />
              ))}
            </FilterRow>
          )}

          {anyActive && (
            <button
              onClick={() => {
                setModality('all')
                setActiveTopics([])
                setRequirement('all')
              }}
              className="font-mono text-xs uppercase tracking-widest text-neutral-400 underline-offset-4 hover:text-black hover:underline"
            >
              Limpiar filtros ({filtered.length} de {courses.length})
            </button>
          )}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="font-mono text-sm text-neutral-500">
          No hay cursos que coincidan con los filtros.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course) => (
            <CourseCard key={course.id} course={course} track={track} onClick={setSelected} />
          ))}
        </div>
      )}

      <CourseDrawer course={selected} onClose={() => setSelected(null)} />
    </>
  )
}

function FilterRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 font-mono text-[10px] uppercase tracking-widest text-neutral-400">
        {label}
      </span>
      {children}
    </div>
  )
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full border px-4 py-1.5 font-display text-sm font-bold tracking-wide transition-colors ${
        active
          ? 'border-facu-green bg-facu-green text-black'
          : 'border-neutral-300 bg-white text-neutral-700 hover:border-black hover:text-black'
      }`}
    >
      {label}
    </button>
  )
}
