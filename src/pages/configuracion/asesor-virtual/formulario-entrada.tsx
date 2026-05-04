import Head from 'next/head'
import { ReactElement } from 'react'
import { NavigationLayout } from '@/layouts/NavigationLayout'
import { FormularioEntradaContainer } from '@/containers/settings/AsistenteVirtual/FormularioEntradaContainer'

const FormularioEntrada = () => {
	return (
		<>
			<Head>
				<title>
					Configuración - Asesor virtual - Formulario de entrada
				</title>
				<meta
					name="description"
					content="Configuración - Asesor virtual - Formulario de entrada"
				/>
			</Head>
			<FormularioEntradaContainer />
		</>
	)
}

FormularioEntrada.getLayout = function getLayout(page: ReactElement) {
	return <NavigationLayout>{page}</NavigationLayout>
}

export default FormularioEntrada
