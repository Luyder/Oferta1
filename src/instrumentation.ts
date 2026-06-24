export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return

  // Initialize Payload at server startup so the adapter's `prodMigrations`
  // run (creating all tables) before any request is served.
  try {
    const { getPayload } = await import('payload')
    const { default: config } = await import('@payload-config')
    await getPayload({ config })
  } catch (e) {
    console.error('[instrumentation] Payload init/migrate error:', e)
  }
}
