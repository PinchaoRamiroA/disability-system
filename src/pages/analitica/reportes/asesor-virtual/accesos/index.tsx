import Head from 'next/head'
import { NavigationLayout } from '@/layouts/NavigationLayout'
import { ReactElement } from 'react'
import { AccessContainer } from '@/containers/analytics/reports/asesor-virtual/AccessContainer'

const Access = () => {
	return (
		<>
			<Head>
				<title>Reportes - Asesor virtual - Accesos</title>
				<meta
					name="description"
					content="Reportes - Asesor virtual: Accesos"
				/>
			</Head>
			<AccessContainer />
		</>
	)
}

Access.getLayout = function getLayout(page: ReactElement) {
	return <NavigationLayout>{page}</NavigationLayout>
}

export default Access
