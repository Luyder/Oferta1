export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { getPayload } = await import('payload')
    const { default: config } = await import('@payload-config')
    try {
      await getPayload({ config })
    } catch (e) {
      console.error('[instrumentation] Payload init error:', e)
    }
  }
}
