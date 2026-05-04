import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'

import { WebChatHeader } from '@/components/WebChat/WebChatHeader'
import { WebChatBody } from '@/components/WebChat/WebChatBody'

import { WebChatFooterWrapper } from './WebChatFooterWrapper'
import { useChatContext } from '@/hooks/asesor-humano/useChatContext'

interface Props {
	openTransfer: boolean
	setOpenTransfer: (value: boolean) => void
	showComponent?: boolean
}

export const ChatBoxContainer = ({
	openTransfer,
	setOpenTransfer,
	showComponent,
}: Props) => {
	const { chatHeaderHeigth, chatContentBg } = useChatContext()
	const [footerHeight, setFooterHeight] = useState<number>(0)

	const handleSetHeigth = (value: number | undefined) => {
		if (value) {
			setFooterHeight(value)
		} else {
			setFooterHeight(56)
		}
	}

	if (!showComponent) {
		return null
	}

	return (
		<Box
			component="main"
			sx={{
				flex: 1,
				p: 0,
				display: 'flex',
				flexDirection: 'column',
				minHeight: '100vh',
				boxSizing: 'border-box',
			}}
		>
			<Toolbar variant="regular" />
			<WebChatHeader
				height={chatHeaderHeigth}
				openTransferModal={openTransfer}
				setOpenTransferModal={setOpenTransfer}
			/>

			<WebChatBody
				headerHeight={chatHeaderHeigth}
				footerHeight={footerHeight}
				backgroundColor={chatContentBg}
			/>

			<WebChatFooterWrapper setHeight={handleSetHeigth} />
		</Box>
	)
}
