import React from 'react'
import { AppBar, Toolbar } from '@mui/material'

import { WebChatUserMenu } from './WebChatUserMenu'
import { LogoOrg } from '../Appbar/LogoOrg/LogoOrg'

export const WebChatAppbar = ({
	connectionIssues,
}: {
	connectionIssues: boolean
}) => {
	return (
		<AppBar
			position="fixed"
			sx={{ zIndex: (theme) => theme.zIndex.appBar + 101 }}
		>
			<Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
				<LogoOrg />
				{/* Menú de usuario */}
				<WebChatUserMenu connectionIssues={connectionIssues} />
			</Toolbar>
		</AppBar>
	)
}
