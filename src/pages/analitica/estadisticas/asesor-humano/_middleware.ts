import { humanAgent } from '@/utils/constants/grantAccess'
import { NextResponse, NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
	const url = req.nextUrl.clone()

	console.log('MIDDLEWARE: statistics/asesor-humano')
	if (url.pathname === '/analitica/estadisticas/asesor-humano') {
		const newPathname = humanAgent.subRoutes?.[0].path
		url.pathname = `${url.pathname}/${newPathname}`
		return NextResponse.redirect(url)
	}

	return NextResponse.next()
}
