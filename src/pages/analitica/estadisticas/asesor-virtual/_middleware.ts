import { virtualAgent } from '@/utils/constants/grantAccess'
import { NextResponse, NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
	const url = req.nextUrl.clone()

	console.log('MIDDLEWARE: statistics/asesor-virtual')
	if (url.pathname === '/analitica/estadisticas/asesor-virtual') {
		const newPathname = virtualAgent.subRoutes?.[0].path
		url.pathname = `${url.pathname}/${newPathname}`
		return NextResponse.redirect(url)
	}

	return NextResponse.next()
}
