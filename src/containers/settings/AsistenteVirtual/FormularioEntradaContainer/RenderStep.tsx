import React from 'react'
import { Box, Tooltip } from '@mui/material'
import { useDefinePreviewWidgetTheme } from '@/hooks/useDefinePreviewWidgetTheme'

export const RenderStep = ({ step }: { step: number }) => {
	const { widgetForm } = useDefinePreviewWidgetTheme()
	return (
		<Box display="flex" justifyContent="center" mb={1}>
			<Tooltip title={'Paso ' + step}>
				<Box
					sx={{
						background: widgetForm.background,
						color: widgetForm.color,
						width: 30,
						height: 30,
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						borderRadius: 15,
						cursor: 'context-menu',
					}}
				>
					{step}
				</Box>
			</Tooltip>
		</Box>
	)
}
