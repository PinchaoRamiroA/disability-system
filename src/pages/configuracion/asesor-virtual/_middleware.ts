import { virtualAgentSettings } from '@/utils/constants/grantAccess'
import { NextResponse, NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
	const url = req.nextUrl.clone()

	console.log('MIDDLEWARE: settings/asesor-virtual')
	if (url.pathname === '/configuracion/asesor-virtual') {
		const newPathname = virtualAgentSettings.subRoutes?.[0].path
		url.pathname = `${url.pathname}/${newPathname}`
		return NextResponse.redirect(url)
	}

	return NextResponse.next()
}
