export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return

  const fs = await import('fs')
  const path = await import('path')

  // On first boot with a file-based SQLite DB (e.g. a Railway volume that is
  // still empty), copy the bundled seed database into place so the site comes
  // up already populated with all courses and professors. We only copy when
  // the target DB is missing/empty, so admin edits made later are never lost.
  const uri = process.env.DATABASE_URI || ''
  if (uri.startsWith('file:')) {
    let dbPath = uri.slice('file:'.length).replace(/^\/{2,}/, '/')
    const seedPath = path.resolve(process.cwd(), 'seed.sqlite')
    try {
      const exists = fs.existsSync(dbPath) && fs.statSync(dbPath).size > 0
      if (!exists && fs.existsSync(seedPath)) {
        fs.mkdirSync(path.dirname(dbPath), { recursive: true })
        fs.copyFileSync(seedPath, dbPath)
        console.log('[instrumentation] Seeded DB from seed.sqlite ->', dbPath)
      }
    } catch (e) {
      console.error('[instrumentation] Seed copy error:', e)
    }
  }

  // Initialize Payload so the adapter's `prodMigrations` run (creating any
  // missing tables) before any request is served.
  try {
    const { getPayload } = await import('payload')
    const { default: config } = await import('@payload-config')
    await getPayload({ config })
  } catch (e) {
    console.error('[instrumentation] Payload init/migrate error:', e)
  }
}
