import React from 'react'
import { useAppSelector } from '@/hooks/useReduxHooks'
import { dashboardLogoSelector } from '@/store/slices/dashboard-config'
import { Box, Tooltip } from '@mui/material'
import { LogoPreview } from '@/components/Appbar/LogoOrg/LogoPreview'
import { IsWidgetConfig } from '@/types/Settings/General/Dashboard'
import { widgetAvatarSelector } from '@/store/slices/widgetConfig'

export const LogoTab = ({
	widget,
	borderRadius = false,
	height,
	width,
}: IsWidgetConfig & {
	borderRadius?: boolean
	height?: number
	width?: number
}) => {
	const { resource: logo } = useAppSelector(dashboardLogoSelector)
	const { resource: avatar } = useAppSelector(widgetAvatarSelector)

	const resource = widget ? avatar : logo

	return (
		<>
			{resource.file || resource.url.length ? (
				<Tooltip title="Logo">
					<Box>
						<LogoPreview
							url={
								resource.file
									? URL.createObjectURL(resource.file)
									: resource.url
							}
							borderRadius={borderRadius}
							height={height}
							width={width}
						/>
					</Box>
				</Tooltip>
			) : null}
		</>
	)
}
