import { statistics } from '@/utils/constants/grantAccess'
import { NextResponse, NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()

  console.log('MIDDLEWARE: statistics')
  if (url.pathname === '/analitica/estadisticas') {
    const newPathname = statistics.subRoutes?.[0].path
    url.pathname = `${url.pathname}/${newPathname}`
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}
