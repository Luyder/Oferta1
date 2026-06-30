import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { titleNormalizeds } = body

    if (!Array.isArray(titleNormalizeds)) {
      return NextResponse.json({ error: 'titleNormalizeds required' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    await Promise.all(
      titleNormalizeds.map(async (tn: string, index: number) => {
        const { docs } = await payload.find({
          collection: 'courses',
          where: { titleNormalized: { equals: tn } },
          limit: 100,
        })
        await Promise.all(
          docs.map((doc) =>
            payload.update({
              collection: 'courses',
              id: doc.id,
              data: { order: index },
            }),
          ),
        )
      }),
    )

    return NextResponse.json({ updated: titleNormalizeds.length })
  } catch (err) {
    console.error('Reorder error:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
