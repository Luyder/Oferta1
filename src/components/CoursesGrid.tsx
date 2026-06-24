'use client'

import { useState } from 'react'
import CourseCard, { type CourseData } from './CourseCard'
import CourseDrawer from './CourseDrawer'

type Props = {
  courses: CourseData[]
  filterOptions?: Array<{ label: string; value: string }>
  filterKey?: keyof CourseData
}

export default function CoursesGrid({ courses, filterOptions, filterKey }: Props) {
  const [selected, setSelected] = useState<CourseData | null>(null)
  const [activeFilter, setActiveFilter] = useState<string>('all')

  const filtered =
    activeFilter === 'all' || !filterKey
      ? courses
      : courses.filter((c) => c[filterKey] === activeFilter)

  return (
    <>
      {/* Filter tabs */}
      {filterOptions && filterOptions.length > 0 && (
        <div className="scrollbar-hide mb-8 flex gap-2 overflow-x-auto pb-1">
          <FilterButton
            label="TODOS"
            active={activeFilter === 'all'}
            onClick={() => setActiveFilter('all')}
          />
          {filterOptions.map((opt) => (
            <FilterButton
              key={opt.value}
              label={opt.label}
              active={activeFilter === opt.value}
              onClick={() => setActiveFilter(opt.value)}
            />
          ))}
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="font-mono text-sm text-neutral-500">
          No hay cursos en esta categoría.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course) => (
            <CourseCard key={course.id} course={course} onClick={setSelected} />
          ))}
        </div>
      )}

      {/* Drawer */}
      <CourseDrawer course={selected} onClose={() => setSelected(null)} />
    </>
  )
}

function FilterButton({
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
      className={`shrink-0 rounded-full border px-5 py-2 font-display text-sm font-bold tracking-wide transition-colors ${
        active
          ? 'border-black bg-black text-white'
          : 'border-neutral-300 bg-white text-black hover:border-black'
      }`}
    >
      {label}
    </button>
  )
}
