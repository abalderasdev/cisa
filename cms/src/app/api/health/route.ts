import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const requestHeaders = await headers()
  const response = NextResponse.json(
    {
      ok: true,
      service: 'cisa-cms',
      time: new Date().toISOString(),
    },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    },
  )

  // Se evita que proxies o intermediaries cacheen la comprobación de salud.
  void requestHeaders

  return response
}
