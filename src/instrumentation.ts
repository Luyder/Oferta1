export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return

  // Payload's "push" (auto-create tables from the schema) only runs when
  // NODE_ENV !== 'production'. On Railway NODE_ENV is 'production', so the
  // tables never get created. We temporarily flip NODE_ENV while Payload
  // connects so it pushes the schema, then restore it. This runs once at
  // server startup, before any request is served.
  const prev = process.env.NODE_ENV
  try {
    // @ts-expect-error NODE_ENV is writable at runtime
    process.env.NODE_ENV = 'development'
    const { getPayload } = await import('payload')
    const { default: config } = await import('@payload-config')
    await getPayload({ config })
  } catch (e) {
    console.error('[instrumentation] Payload init/push error:', e)
  } finally {
    // @ts-expect-error restore
    process.env.NODE_ENV = prev
  }
}
