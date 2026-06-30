'use client'

import { useRef, useState } from 'react'
import { PROGRAM_GROUPS } from '@/lib/programs'

type ProgramRequirement = { program: string; requirement: 'obligatoria' | 'electiva' }

export type CourseGroup = {
  titleNormalized: string
  title: string
  count: number
  programType: string
  subProgram: string | null
  programRequirements: ProgramRequirement[]
  imageId?: number | string | null
  imageUrl?: string | null
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
        Cursos con 2 o más secciones (NRC). Edita el track, los requisitos y la foto de todas las secciones a la vez.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {groups.map((group) => (
          <GroupCard key={group.titleNormalized} group={group} />
        ))}
      </div>
    </div>
  )
}

const selectStyle: React.CSSProperties = {
  padding: '6px 10px',
  borderRadius: '4px',
  border: '1px solid var(--theme-elevation-300)',
  background: 'var(--theme-elevation-0)',
  fontFamily: 'sans-serif',
  fontSize: '0.88rem',
}

function ProgramSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} style={{ ...selectStyle, flex: 1 }}>
      <option value="">— seleccionar programa —</option>
      {PROGRAM_GROUPS.map((group) => (
        <optgroup key={group.label} label={group.label}>
          {group.programs.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </optgroup>
      ))}
    </select>
  )
}

function GroupCard({ group }: { group: CourseGroup }) {
  const [subProgram, setSubProgram] = useState(group.subProgram ?? '')
  const [reqs, setReqs] = useState<ProgramRequirement[]>(group.programRequirements)
  const [pendingImageId, setPendingImageId] = useState<number | string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(group.imageUrl ?? null)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const addReq = () => setReqs([...reqs, { program: '', requirement: 'obligatoria' }])
  const removeReq = (i: number) => setReqs(reqs.filter((_, idx) => idx !== i))
  const updateReq = (i: number, field: keyof ProgramRequirement, value: string) =>
    setReqs(reqs.map((r, idx) => (idx === i ? { ...r, [field]: value } : r)))

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Instant local preview
    setPreviewUrl(URL.createObjectURL(file))
    setUploadStatus('uploading')

    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/upload-media', { method: 'POST', body: form })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setPendingImageId(data.id)
      if (data.url) setPreviewUrl(data.url)
      setUploadStatus('done')
      setTimeout(() => setUploadStatus('idle'), 3000)
    } catch {
      setUploadStatus('error')
      setTimeout(() => setUploadStatus('idle'), 4000)
    }
  }

  const save = async () => {
    setSaveStatus('saving')
    try {
      const body: Record<string, unknown> = {
        titleNormalized: group.titleNormalized,
        programRequirements: reqs.filter((r) => r.program.trim()),
      }
      if (group.programType === 'MS') body.subProgram = subProgram || null
      if (pendingImageId !== null) body.imageId = pendingImageId
      const res = await fetch('/api/bulk-update-group', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error()
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 4000)
    }
  }

  const saveBg =
    saveStatus === 'saved' ? '#16a34a' : saveStatus === 'error' ? '#dc2626' : '#4f46e5'

  const uploadBtnBg =
    uploadStatus === 'uploading'
      ? 'var(--theme-elevation-200)'
      : uploadStatus === 'done'
      ? '#dcfce7'
      : uploadStatus === 'error'
      ? '#fee2e2'
      : 'var(--theme-elevation-100)'

  const uploadBtnColor =
    uploadStatus === 'done' ? '#15803d' : uploadStatus === 'error' ? '#dc2626' : 'var(--theme-elevation-700)'

  return (
    <div style={{ border: '1px solid var(--theme-elevation-200)', borderRadius: '8px', padding: '1.25rem 1.5rem', background: 'var(--theme-elevation-50)' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.1rem' }}>
        <div>
          <div style={{ fontFamily: 'sans-serif', fontWeight: 700, fontSize: '0.95rem' }}>{group.title}</div>
          <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--theme-elevation-500)', marginTop: '2px' }}>
            {group.count} secciones (NRC) · {group.programType}
          </div>
        </div>
        <button
          onClick={save}
          disabled={saveStatus === 'saving'}
          style={{ padding: '7px 18px', background: saveBg, color: 'white', border: 'none', borderRadius: '6px', cursor: saveStatus === 'saving' ? 'wait' : 'pointer', fontFamily: 'sans-serif', fontWeight: 600, fontSize: '0.85rem', flexShrink: 0 }}
        >
          {saveStatus === 'saving' ? 'Guardando…' : saveStatus === 'saved' ? '✓ Guardado' : saveStatus === 'error' ? 'Error — reintentar' : 'Guardar todas'}
        </button>
      </div>

      {/* Foto */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', fontFamily: 'sans-serif', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
          Foto del curso
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: 110, height: 74, borderRadius: '6px', overflow: 'hidden', background: 'var(--theme-elevation-150)', flexShrink: 0, border: '1px solid var(--theme-elevation-200)' }}>
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', color: 'var(--theme-elevation-400)', fontFamily: 'monospace' }}>
                Sin imagen
              </div>
            )}
          </div>
          <div>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileSelect} />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadStatus === 'uploading'}
              style={{ padding: '6px 14px', background: uploadBtnBg, color: uploadBtnColor, border: '1px solid var(--theme-elevation-200)', borderRadius: '5px', cursor: uploadStatus === 'uploading' ? 'wait' : 'pointer', fontFamily: 'sans-serif', fontSize: '0.84rem', fontWeight: 500 }}
            >
              {uploadStatus === 'uploading' ? 'Subiendo…' : uploadStatus === 'done' ? '✓ Foto lista' : uploadStatus === 'error' ? 'Error al subir' : previewUrl ? 'Cambiar foto' : 'Subir foto'}
            </button>
            {uploadStatus === 'idle' && previewUrl && (
              <p style={{ margin: '4px 0 0', fontFamily: 'sans-serif', fontSize: '0.75rem', color: 'var(--theme-elevation-400)' }}>
                Se aplicará al guardar
              </p>
            )}
            {uploadStatus === 'done' && (
              <p style={{ margin: '4px 0 0', fontFamily: 'sans-serif', fontSize: '0.75rem', color: '#15803d' }}>
                Foto subida · guarda para asignarla
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Track de maestría — solo MS */}
      {group.programType === 'MS' && (
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontFamily: 'sans-serif', fontSize: '0.82rem', fontWeight: 600, marginBottom: '5px' }}>
            Track de maestría
          </label>
          <select value={subProgram} onChange={(e) => setSubProgram(e.target.value)} style={selectStyle}>
            <option value="">(sin asignar)</option>
            <option value="profundizacion">Profundización</option>
            <option value="investigacion">Investigación</option>
            <option value="compartido">Compartido (ambos tracks)</option>
          </select>
        </div>
      )}

      {/* programRequirements */}
      <div>
        <label style={{ display: 'block', fontFamily: 'sans-serif', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
          Obligatoria / Electiva por programa
        </label>
        {reqs.map((req, i) => (
          <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '6px', alignItems: 'center' }}>
            <ProgramSelect value={req.program} onChange={(v) => updateReq(i, 'program', v)} />
            <select value={req.requirement} onChange={(e) => updateReq(i, 'requirement', e.target.value as 'obligatoria' | 'electiva')} style={selectStyle}>
              <option value="obligatoria">Obligatoria</option>
              <option value="electiva">Electiva</option>
            </select>
            <button onClick={() => removeReq(i)} title="Eliminar" style={{ padding: '6px 10px', background: 'transparent', border: '1px solid var(--theme-elevation-300)', borderRadius: '4px', cursor: 'pointer', color: '#dc2626', fontFamily: 'sans-serif', fontSize: '0.9rem' }}>✕</button>
          </div>
        ))}
        <button onClick={addReq} style={{ padding: '5px 14px', background: 'transparent', border: '1px dashed var(--theme-elevation-400)', borderRadius: '4px', cursor: 'pointer', fontFamily: 'sans-serif', fontSize: '0.82rem', color: 'var(--theme-elevation-600)', marginTop: '4px' }}>
          + Agregar programa
        </button>
      </div>
    </div>
  )
}
