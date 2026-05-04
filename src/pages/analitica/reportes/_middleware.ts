import { reports } from '@/utils/constants/grantAccess'
import { NextResponse, NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()

  console.log('MIDDLEWARE: reports')
  if (url.pathname === '/analitica/reportes') {
    const newPathname = reports.subRoutes?.[0].path
    url.pathname = `${url.pathname}/${newPathname}`
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}
