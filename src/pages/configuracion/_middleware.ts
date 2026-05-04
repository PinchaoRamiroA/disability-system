import { NextResponse, NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
	const url = req.nextUrl.clone()

	console.log('MIDDLEWARE: settings')
	if (url.pathname === '/configuracion/administrar-usuarios') {
		const newPathname = 'usuarios'
		url.pathname = `${url.pathname}/${newPathname}`
		return NextResponse.redirect(url)
	}

	return NextResponse.next()
}
