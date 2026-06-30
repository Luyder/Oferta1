import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const payload = await getPayload({ config })
    const buffer = Buffer.from(await file.arrayBuffer())

    const media = await payload.create({
      collection: 'media',
      data: {
        alt: file.name.replace(/\.[^/.]+$/, ''),
      },
      file: {
        data: buffer,
        mimetype: file.type,
        name: file.name,
        size: file.size,
      },
    })

    const url =
      (media as any).sizes?.card?.url ?? (media as any).url ?? null

    return NextResponse.json({ id: media.id, url })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
