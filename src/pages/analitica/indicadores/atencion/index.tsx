import Head from 'next/head'
import { NavigationLayout } from '@/layouts/NavigationLayout'
import { ReactElement } from 'react'
import { AttentionContainer } from 'containers/analytics/indicators/AttentionContainer'

const Attention = () => {
  return (
    <>
      <Head>
        <title>Indicadores - Atención</title>
        <meta
          name="description"
          content="Indicador: Niveles de atención y TMO"
        />
      </Head>
      <AttentionContainer />
    </>
  )
}

Attention.getLayout = function getLayout(page: ReactElement) {
  return <NavigationLayout>{page}</NavigationLayout>
}

export default Attention
