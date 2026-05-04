import { WebChatContainer } from '@/containers/WebChatContainer'
import Head from 'next/head'

const Chat = () => {
	return (
		<>
			<Head>
				<title>Asesor humano - Chat</title>
				<meta
					name="description"
					content="Módulo de atención al cliente con asesor humano"
				/>
			</Head>
			<WebChatContainer />
		</>
	)
}

export default Chat
