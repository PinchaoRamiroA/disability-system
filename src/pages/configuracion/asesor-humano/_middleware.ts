import { humanAgentSettings } from '@/utils/constants/grantAccess'
import { NextResponse, NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
	const url = req.nextUrl.clone()

	console.log('MIDDLEWARE: settings/asesor-humano')
	if (url.pathname === '/configuracion/asesor-humano') {
		const newPathname = humanAgentSettings.subRoutes?.[0].path
		url.pathname = `${url.pathname}/${newPathname}`
		return NextResponse.redirect(url)
	}

	return NextResponse.next()
}
