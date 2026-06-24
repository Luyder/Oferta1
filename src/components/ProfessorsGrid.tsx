'use client'

import { useState } from 'react'
import Image from 'next/image'
import ProfessorDrawer, { type ProfessorData } from './ProfessorDrawer'

export default function ProfessorsGrid({ professors }: { professors: ProfessorData[] }) {
  const [selected, setSelected] = useState<ProfessorData | null>(null)

  return (
    <>
      <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {professors.map((prof) => (
          <button
            key={prof.id}
            onClick={() => setSelected(prof)}
            className="group flex flex-col gap-3 text-left focus:outline-none"
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-black/10 ring-1 ring-black/10 transition-transform duration-200 group-hover:-translate-y-1 group-hover:shadow-xl">
              {prof.photo?.url ? (
                <Image
                  src={prof.photo.url}
                  alt={prof.photo.alt ?? prof.name}
                  fill
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="font-display text-4xl font-black text-black/20">
                    {prof.name.split(' ').slice(0, 2).map(w => w[0]).join('')}
                  </span>
                </div>
              )}
            </div>
            <div>
              <p className="font-display text-sm font-black uppercase leading-tight tracking-wide text-black">
                {prof.name}
              </p>
              {prof.rank && <p className="mt-0.5 text-sm text-black/70">{prof.rank}</p>}
              {prof.courses.length > 0 && (
                <p className="mt-1 font-mono text-xs text-black/50">
                  {prof.courses.length} {prof.courses.length === 1 ? 'curso' : 'cursos'}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>

      <ProfessorDrawer professor={selected} onClose={() => setSelected(null)} />
    </>
  )
}
