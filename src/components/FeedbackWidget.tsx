'use client'

import { useState } from 'react'

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [contact, setContact] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const send = async () => {
    if (!message.trim()) return
    setStatus('sending')
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          contact,
          page: typeof window !== 'undefined' ? window.location.pathname : '',
        }),
      })
      if (!res.ok) throw new Error()
      setStatus('sent')
      setMessage('')
      setContact('')
      setTimeout(() => {
        setOpen(false)
        setStatus('idle')
      }, 2000)
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      {/* Botón discreto fijo abajo a la derecha */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-4 right-4 z-40 rounded-full border border-neutral-300 bg-white/90 px-4 py-2 font-body text-xs text-neutral-600 shadow-sm backdrop-blur transition-colors hover:border-black hover:text-black"
          aria-label="Dar feedback sobre la página"
        >
          ¿Falta algo? ¿Cómo podemos mejorarlo?
        </button>
      )}

      {open && (
        <div className="fixed bottom-4 right-4 z-40 w-[calc(100vw-2rem)] max-w-sm rounded-2xl border border-neutral-200 bg-white p-4 shadow-xl">
          <div className="mb-2 flex items-start justify-between gap-2">
            <p className="font-display text-sm font-bold text-black">
              ¿Falta algo? ¿Cómo podemos mejorarlo?
            </p>
            <button
              onClick={() => setOpen(false)}
              className="shrink-0 font-mono text-lg leading-none text-neutral-400 hover:text-black"
              aria-label="Cerrar"
            >
              ×
            </button>
          </div>

          {status === 'sent' ? (
            <p className="py-4 text-center font-body text-sm text-neutral-600">
              ¡Gracias por tu comentario! 🌱
            </p>
          ) : (
            <>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Cuéntanos qué mejorarías, qué falta o qué está mal…"
                rows={4}
                className="w-full resize-none rounded-lg border border-neutral-300 bg-white p-2.5 font-body text-sm text-black placeholder:text-neutral-400 focus:border-black focus:outline-none"
              />
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Correo o nombre (opcional)"
                className="mt-2 w-full rounded-lg border border-neutral-300 bg-white p-2.5 font-body text-sm text-black placeholder:text-neutral-400 focus:border-black focus:outline-none"
              />
              {status === 'error' && (
                <p className="mt-2 font-body text-xs text-red-600">
                  No se pudo enviar. Intenta de nuevo.
                </p>
              )}
              <button
                onClick={send}
                disabled={!message.trim() || status === 'sending'}
                className="mt-3 w-full rounded-full bg-black py-2.5 font-display text-sm font-bold text-white transition-colors hover:bg-neutral-800 disabled:cursor-default disabled:bg-neutral-300"
              >
                {status === 'sending' ? 'Enviando…' : 'Enviar comentario'}
              </button>
            </>
          )}
        </div>
      )}
    </>
  )
}
