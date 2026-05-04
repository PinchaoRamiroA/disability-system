import { humanAgentReports } from '@/utils/constants/grantAccess'
import { NextResponse, NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
	const url = req.nextUrl.clone()

	console.log('MIDDLEWARE: reportes/asesor-humano')
	if (url.pathname === '/analitica/reportes/asesor-humano') {
		const newPathname = humanAgentReports.subRoutes?.[0].path
		url.pathname = `${url.pathname}/${newPathname}`
		return NextResponse.redirect(url)
	}

	return NextResponse.next()
}
