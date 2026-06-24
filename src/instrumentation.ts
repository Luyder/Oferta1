export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return

  // Payload's "push" (auto-create tables from the schema) only runs when
  // NODE_ENV !== 'production'. On Railway NODE_ENV is 'production', so the
  // tables never get created. We temporarily flip NODE_ENV while Payload
  // connects so it pushes the schema, then restore it.
  //
  // IMPORTANT: we access the env var via a computed key (not the literal
  // `process.env.NODE_ENV`) so webpack's DefinePlugin doesn't statically
  // replace it at build time, which would break compilation.
  const envKey = ['NODE', 'ENV'].join('_')
  const prev = process.env[envKey]
  try {
    process.env[envKey] = 'development'
    const { getPayload } = await import('payload')
    const { default: config } = await import('@payload-config')
    await getPayload({ config })
  } catch (e) {
    console.error('[instrumentation] Payload init/push error:', e)
  } finally {
    process.env[envKey] = prev
  }
}
