'use client'

import { useState } from 'react'
import CoursesGrid from './CoursesGrid'
import type { CourseData } from './CourseCard'

type Section = {
  key: string
  label: string
  sublabel?: string
  courses: CourseData[]
  accent: string
  dark?: boolean
}

export default function PosgradoClient({ sections }: { sections: Section[] }) {
  const [active, setActive] = useState(sections[0]?.key ?? '')

  const current = sections.find(s => s.key === active) ?? sections[0]

  return (
    <>
      {/* Tab bar */}
      <div className="scrollbar-hide mb-8 flex gap-2 overflow-x-auto pb-1">
        {sections.map(s => (
          <button
            key={s.key}
            onClick={() => setActive(s.key)}
            className={`shrink-0 rounded-full px-4 py-2 font-display text-sm font-black tracking-wider transition-colors ${
              active === s.key
                ? s.dark
                  ? 'bg-black text-white'
                  : 'bg-facu-green text-black'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            {s.label}
            {s.sublabel && (
              <span className="ml-1.5 font-mono text-[10px] font-normal normal-case tracking-normal opacity-70">
                {s.sublabel}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Section header */}
      {current && (
        <>
          <div className="mb-6 flex items-end gap-4">
            <div className={`h-8 w-1.5 rounded-full ${current.accent}`} />
            <div>
              <h2 className="font-display text-2xl font-black tracking-tight leading-none">
                {current.label}
              </h2>
              {current.sublabel && (
                <p className="mt-1 font-mono text-xs uppercase tracking-widest text-neutral-400">
                  {current.sublabel}
                </p>
              )}
              <p className="mt-0.5 font-mono text-xs uppercase tracking-widest text-neutral-400">
                {current.courses.length} {current.courses.length === 1 ? 'curso' : 'cursos'} · 2026-2
              </p>
            </div>
          </div>
          <CoursesGrid courses={current.courses} />
        </>
      )}
    </>
  )
}
