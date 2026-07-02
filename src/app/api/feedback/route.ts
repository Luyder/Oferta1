import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const message = typeof body.message === 'string' ? body.message.trim() : ''
    const page = typeof body.page === 'string' ? body.page.slice(0, 200) : ''
    const contact = typeof body.contact === 'string' ? body.contact.trim().slice(0, 200) : ''

    if (!message) {
      return NextResponse.json({ error: 'Comentario vacío' }, { status: 400 })
    }
    if (message.length > 4000) {
      return NextResponse.json({ error: 'Comentario demasiado largo' }, { status: 400 })
    }

    const payload = await getPayload({ config })
    await payload.create({
      collection: 'feedback',
      data: { message, page, contact: contact || undefined },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Feedback error:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
