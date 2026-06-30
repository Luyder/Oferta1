'use client'

import { useState } from 'react'

type ProgramRequirement = { program: string; requirement: 'obligatoria' | 'electiva' }

export type CourseGroup = {
  titleNormalized: string
  title: string
  count: number
  subProgram: string | null
  programRequirements: ProgramRequirement[]
}

export default function BulkEditClient({ groups }: { groups: CourseGroup[] }) {
  if (groups.length === 0) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'sans-serif', color: 'var(--theme-elevation-500)' }}>
        No hay cursos con varias secciones.
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '860px' }}>
      <h1 style={{ fontFamily: 'sans-serif', fontSize: '1.4rem', fontWeight: 700, margin: '0 0 0.4rem' }}>
        Edición masiva de cursos
      </h1>
      <p style={{ fontFamily: 'sans-serif', fontSize: '0.9rem', color: 'var(--theme-elevation-500)', margin: '0 0 2rem' }}>
        Cursos con 2 o más secciones (NRC). Edita el track de maestría y los requisitos de todas las secciones a la vez.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {groups.map((group) => (
          <GroupCard key={group.titleNormalized} group={group} />
        ))}
      </div>
    </div>
  )
}

function GroupCard({ group }: { group: CourseGroup }) {
  const [subProgram, setSubProgram] = useState(group.subProgram ?? '')
  const [reqs, setReqs] = useState<ProgramRequirement[]>(group.programRequirements)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  const addReq = () => setReqs([...reqs, { program: '', requirement: 'obligatoria' }])
  const removeReq = (i: number) => setReqs(reqs.filter((_, idx) => idx !== i))
  const updateReq = (i: number, field: keyof ProgramRequirement, value: string) =>
    setReqs(reqs.map((r, idx) => (idx === i ? { ...r, [field]: value } : r)))

  const save = async () => {
    setStatus('saving')
    try {
      const res = await fetch('/api/bulk-update-group', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titleNormalized: group.titleNormalized,
          subProgram: subProgram || null,
          programRequirements: reqs.filter((r) => r.program.trim()),
        }),
      })
      if (!res.ok) throw new Error()
      setStatus('saved')
      setTimeout(() => setStatus('idle'), 3000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 4000)
    }
  }

  const btnBg =
    status === 'saved' ? '#16a34a' : status === 'error' ? '#dc2626' : '#4f46e5'

  return (
    <div
      style={{
        border: '1px solid var(--theme-elevation-200)',
        borderRadius: '8px',
        padding: '1.25rem 1.5rem',
        background: 'var(--theme-elevation-50)',
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.1rem' }}>
        <div>
          <div style={{ fontFamily: 'sans-serif', fontWeight: 700, fontSize: '0.95rem' }}>{group.title}</div>
          <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--theme-elevation-500)', marginTop: '2px' }}>
            {group.count} secciones (NRC)
          </div>
        </div>
        <button
          onClick={save}
          disabled={status === 'saving'}
          style={{
            padding: '7px 18px',
            background: btnBg,
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: status === 'saving' ? 'wait' : 'pointer',
            fontFamily: 'sans-serif',
            fontWeight: 600,
            fontSize: '0.85rem',
            flexShrink: 0,
          }}
        >
          {status === 'saving' ? 'Guardando…' : status === 'saved' ? '✓ Guardado' : status === 'error' ? 'Error — reintentar' : 'Guardar todas'}
        </button>
      </div>

      {/* subProgram */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', fontFamily: 'sans-serif', fontSize: '0.82rem', fontWeight: 600, marginBottom: '5px' }}>
          Track de maestría
        </label>
        <select
          value={subProgram}
          onChange={(e) => setSubProgram(e.target.value)}
          style={{
            padding: '6px 10px',
            borderRadius: '4px',
            border: '1px solid var(--theme-elevation-300)',
            background: 'var(--theme-elevation-0)',
            fontFamily: 'sans-serif',
            fontSize: '0.88rem',
          }}
        >
          <option value="">(sin asignar)</option>
          <option value="profundizacion">Profundización</option>
          <option value="investigacion">Investigación</option>
          <option value="compartido">Compartido (ambos tracks)</option>
        </select>
      </div>

      {/* programRequirements */}
      <div>
        <label style={{ display: 'block', fontFamily: 'sans-serif', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
          Obligatoria / Electiva por programa
        </label>
        {reqs.map((req, i) => (
          <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '6px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Ej: Maestría en Educación Investigación"
              value={req.program}
              onChange={(e) => updateReq(i, 'program', e.target.value)}
              style={{
                flex: 1,
                padding: '6px 10px',
                borderRadius: '4px',
                border: '1px solid var(--theme-elevation-300)',
                background: 'var(--theme-elevation-0)',
                fontFamily: 'sans-serif',
                fontSize: '0.88rem',
              }}
            />
            <select
              value={req.requirement}
              onChange={(e) => updateReq(i, 'requirement', e.target.value as 'obligatoria' | 'electiva')}
              style={{
                padding: '6px 10px',
                borderRadius: '4px',
                border: '1px solid var(--theme-elevation-300)',
                background: 'var(--theme-elevation-0)',
                fontFamily: 'sans-serif',
                fontSize: '0.88rem',
              }}
            >
              <option value="obligatoria">Obligatoria</option>
              <option value="electiva">Electiva</option>
            </select>
            <button
              onClick={() => removeReq(i)}
              title="Eliminar"
              style={{
                padding: '6px 10px',
                background: 'transparent',
                border: '1px solid var(--theme-elevation-300)',
                borderRadius: '4px',
                cursor: 'pointer',
                color: '#dc2626',
                fontFamily: 'sans-serif',
                fontSize: '0.9rem',
              }}
            >
              ✕
            </button>
          </div>
        ))}
        <button
          onClick={addReq}
          style={{
            padding: '5px 14px',
            background: 'transparent',
            border: '1px dashed var(--theme-elevation-400)',
            borderRadius: '4px',
            cursor: 'pointer',
            fontFamily: 'sans-serif',
            fontSize: '0.82rem',
            color: 'var(--theme-elevation-600)',
            marginTop: '4px',
          }}
        >
          + Agregar programa
        </button>
      </div>
    </div>
  )
}
