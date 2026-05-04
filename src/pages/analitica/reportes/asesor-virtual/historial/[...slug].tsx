import Head from 'next/head'
import { NavigationLayout } from '@/layouts/NavigationLayout'
import { ReactElement } from 'react'
import { HistoryContainer } from '@/containers/analytics/reports/asesor-virtual/HistoryContainer'
import { useRouter } from 'next/router'
const History = () => {
	const router = useRouter()
	const { slug } = router.query

	return (
		<>
			<Head>
				<title>
					Reportes - Asesor virtual - Historial y Trazabilidad
				</title>
				<meta
					name="description"
					content="Reportes - Asesor virtual: Historial y Trazabilidad"
				/>
			</Head>
			{slug && <HistoryContainer params={slug} />}
		</>
	)
}

History.getLayout = function getLayout(page: ReactElement) {
	return <NavigationLayout>{page}</NavigationLayout>
}

export default History
