import { indicators } from '@/utils/constants/grantAccess'
import { NextResponse, NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()

  console.log('MIDDLEWARE: analitica')
  if (url.pathname === '/analitica') {
    const newPathname = indicators.subRoutes?.[0].path
    url.pathname = `${url.pathname}/indicadores/${newPathname}`
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}
