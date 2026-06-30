import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { titleNormalized, subProgram, obligatoriaEn, electivaEn, imageId } = body

    if (!titleNormalized) {
      return NextResponse.json({ error: 'titleNormalized required' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    const { docs } = await payload.find({
      collection: 'courses',
      where: { titleNormalized: { equals: titleNormalized } },
      limit: 100,
    })

    const updateData: Record<string, unknown> = {}
    if (subProgram !== undefined) updateData.subProgram = subProgram || null
    if (obligatoriaEn !== undefined) updateData.obligatoriaEn = obligatoriaEn
    if (electivaEn !== undefined) updateData.electivaEn = electivaEn
    if (imageId !== undefined) updateData.image = imageId || null

    await Promise.all(
      docs.map((doc) =>
        payload.update({
          collection: 'courses',
          id: doc.id,
          data: updateData,
        }),
      ),
    )

    return NextResponse.json({ updated: docs.length })
  } catch (err) {
    console.error('Bulk update error:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
