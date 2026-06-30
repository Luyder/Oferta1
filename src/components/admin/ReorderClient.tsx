'use client'

import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export type ReorderCourse = {
  titleNormalized: string
  title: string
  category: string
  programType: string
  subProgram: string | null
  obligatoriaEn: string[]
  electivaEn: string[]
  active: boolean
  count: number
}

export type ReorderSection = {
  key: string
  label: string
  courses: ReorderCourse[]
}

export default function ReorderClient({ sections }: { sections: ReorderSection[] }) {
  const [activeKey, setActiveKey] = useState(sections[0]?.key ?? '')

  if (sections.length === 0) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'sans-serif', color: 'var(--theme-elevation-500)' }}>
        No hay cursos para ordenar.
      </div>
    )
  }

  const activeSection = sections.find((s) => s.key === activeKey) ?? sections[0]

  return (
    <div style={{ padding: '2rem', maxWidth: '700px' }}>
      <h1 style={{ fontFamily: 'sans-serif', fontSize: '1.4rem', fontWeight: 700, margin: '0 0 0.4rem' }}>
        Ordenar cursos
      </h1>
      <p style={{ fontFamily: 'sans-serif', fontSize: '0.9rem', color: 'var(--theme-elevation-500)', margin: '0 0 1.5rem' }}>
        Arrastra los cursos para cambiar el orden en que aparecen en el sitio público.
      </p>

      {/* Tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1.5rem', borderBottom: '1px solid var(--theme-elevation-200)', paddingBottom: '10px' }}>
        {sections.map((s) => (
          <button
            key={s.key}
            onClick={() => setActiveKey(s.key)}
            style={{
              padding: '6px 14px',
              borderRadius: '99px',
              border: 'none',
              background: s.key === activeKey ? '#1e293b' : 'var(--theme-elevation-100)',
              color: s.key === activeKey ? 'white' : 'var(--theme-elevation-700)',
              fontFamily: 'sans-serif',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {s.label} ({s.courses.length})
          </button>
        ))}
      </div>

      <SectionList key={activeSection.key} section={activeSection} />
    </div>
  )
}

function SectionList({ section }: { section: ReorderSection }) {
  const [items, setItems] = useState<ReorderCourse[]>(section.courses)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [dirty, setDirty] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setItems((prev) => {
      const oldIndex = prev.findIndex((c) => c.titleNormalized === active.id)
      const newIndex = prev.findIndex((c) => c.titleNormalized === over.id)
      return arrayMove(prev, oldIndex, newIndex)
    })
    setDirty(true)
  }

  const save = async () => {
    setSaveStatus('saving')
    try {
      const res = await fetch('/api/reorder-courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titleNormalizeds: items.map((c) => c.titleNormalized) }),
      })
      if (!res.ok) throw new Error()
      setSaveStatus('saved')
      setDirty(false)
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 4000)
    }
  }

  const saveBg = saveStatus === 'saved' ? '#16a34a' : saveStatus === 'error' ? '#dc2626' : dirty ? '#4f46e5' : 'var(--theme-elevation-200)'

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
        <button
          onClick={save}
          disabled={!dirty || saveStatus === 'saving'}
          style={{
            padding: '7px 18px',
            background: saveBg,
            color: dirty || saveStatus !== 'idle' ? 'white' : 'var(--theme-elevation-500)',
            border: 'none',
            borderRadius: '6px',
            cursor: dirty && saveStatus !== 'saving' ? 'pointer' : 'default',
            fontFamily: 'sans-serif',
            fontWeight: 600,
            fontSize: '0.85rem',
          }}
        >
          {saveStatus === 'saving' ? 'Guardando…' : saveStatus === 'saved' ? '✓ Guardado' : saveStatus === 'error' ? 'Error — reintentar' : dirty ? 'Guardar orden' : 'Sin cambios'}
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((c) => c.titleNormalized)} strategy={verticalListSortingStrategy}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {items.map((course, i) => (
              <SortableRow key={course.titleNormalized} course={course} index={i} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}

function SortableRow({ course, index }: { course: ReorderCourse; index: number }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: course.titleNormalized,
  })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 14px',
    border: '1px solid var(--theme-elevation-200)',
    borderRadius: '6px',
    background: course.active ? 'var(--theme-elevation-0)' : 'var(--theme-elevation-100)',
  }

  return (
    <div ref={setNodeRef} style={style}>
      <span
        {...attributes}
        {...listeners}
        style={{ cursor: 'grab', color: 'var(--theme-elevation-400)', fontSize: '1.1rem', lineHeight: 1, touchAction: 'none', userSelect: 'none' }}
        aria-label="Arrastrar para reordenar"
      >
        ⠿
      </span>
      <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--theme-elevation-400)', minWidth: '24px' }}>
        {index + 1}
      </span>
      <span style={{ fontFamily: 'sans-serif', fontSize: '0.88rem', fontWeight: 500, flex: 1, color: course.active ? 'var(--theme-elevation-800)' : 'var(--theme-elevation-400)' }}>
        {course.title}
        {!course.active && <span style={{ marginLeft: 8, fontSize: '0.72rem', fontWeight: 600 }}>(inactivo)</span>}
      </span>
      <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: 'var(--theme-elevation-400)' }}>
        {course.count > 1 ? `${course.count} secciones` : ''}
      </span>
    </div>
  )
}
