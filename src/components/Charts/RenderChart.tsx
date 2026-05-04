import React from 'react'
import {
	Box,
	CircularProgress,
	Grid,
	IconButton,
	Paper,
	SxProps,
	Tooltip,
	Typography,
} from '@mui/material'
import { ChartWrapper } from './ChartWrapper'
import { ChildrenType } from '@/types/Children'
import { Info } from '@mui/icons-material'

type Props = {
	chartTitle: string
	dataLength: number
	children: ChildrenType
	loading?: boolean
	styles?: SxProps
	tooltip?: string
	resizeHeight?: boolean
}

export const RenderChart = ({
	children,
	chartTitle,
	dataLength,
	loading,
	styles = {
		overflowX: 'auto',
		textAlign: 'center',
	},
	tooltip,
	resizeHeight,
}: Props) => {
	const height = dataLength <= 15 ? 400 : dataLength <= 30 ? 600 : 1000
	return (
		<Grid item container>
			<Grid item xs={12}>
				<Paper>
					<Box paddingY={2}>
						<Box
							paddingLeft={4}
							paddingTop={1}
							paddingBottom={1}
							display="flex"
							alignItems="center"
						>
							<Typography variant="h5" component="h5">
								{chartTitle}
							</Typography>
							{tooltip && (
								<Tooltip title={tooltip}>
									<IconButton color="primary">
										<Info />
									</IconButton>
								</Tooltip>
							)}
						</Box>

						{loading ? (
							<Box display={'flex'} justifyContent={'center'}>
								<CircularProgress size={30} thickness={5} />
							</Box>
						) : (
							<ChartWrapper
								dataLength={dataLength}
								styles={{
									...styles,
									...(resizeHeight && {
										height: `${height}px`,
										overflow: 'hidden',
									}),
								}}
							>
								{children}
							</ChartWrapper>
						)}
					</Box>
				</Paper>
			</Grid>
		</Grid>
	)
}
