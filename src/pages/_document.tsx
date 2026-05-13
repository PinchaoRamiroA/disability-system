import * as React from 'react'
import Document, {
	Html,
	Head,
	Main,
	NextScript,
	DocumentContext,
	DocumentInitialProps,
} from 'next/document'

import {
	DocumentHeadTags,
	documentGetInitialProps,
} from '@mui/material-nextjs/v16-pagesRouter'

interface MyDocumentProps extends DocumentInitialProps {
	emotionStyleTags: React.ReactElement[]
}

export default class MyDocument extends Document<MyDocumentProps> {
	render() {
		return (
			<Html lang="es">
				<Head>
					<DocumentHeadTags {...this.props} />
				</Head>

				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}

MyDocument.getInitialProps = async (
	ctx: DocumentContext
): Promise<MyDocumentProps> => {
	const finalProps = await documentGetInitialProps(ctx)

	return finalProps as MyDocumentProps
}