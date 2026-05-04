import { isNumber } from '@/utils/helpers/castIndicatorResponse'
import { Info } from '@mui/icons-material'
import {
	Box,
	Card,
	CardContent,
	CircularProgress,
	Grid,
	IconButton,
	Tooltip,
	Typography,
} from '@mui/material'
import React from 'react'

interface Props {
	title: string
	value: string | number
	subtitle?: string
	textAlign?: Align
	height?: number | 'auto'
	loading?: boolean
	small?: boolean
	tooltip?: string
}

type Align = 'center' | 'left' | 'right' | 'justify'

export const Indicator = ({
	title,
	subtitle,
	value,
	textAlign = 'center',
	height = 'auto',
	loading = false,
	small = false,
	tooltip,
}: Props) => {
	return (
		<React.Fragment>
			<Grid
				item
				xs="auto"
				md="auto"
				display={'flex'}
				justifyContent={'center'}
			>
				<Card
					sx={{
						width: small ? 200 : 300,
						height: small ? 100 : height,
						display: 'flex',
						pt: 1,
					}}
				>
					<CardContent
						sx={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'space-evenly',
							width: '100%',
						}}
					>
						<Typography
							variant={small ? 'body2' : 'body1'}
							sx={{ textAlign }}
							fontWeight={small ? 0 : 450}
							mb={small ? 0 : 1}
						>
							{title}
						</Typography>
						{subtitle && (
							<Typography
								variant="body2"
								component="div"
								sx={{ textAlign }}
								mb={small ? 0 : 1}
							>
								{subtitle}
							</Typography>
						)}
						<Typography
							variant={small ? 'h6' : 'h4'}
							textAlign="center"
							sx={{ fontWeight: small ? '' : '800' }}
						>
							{loading ? (
								<CircularProgress size={15} thickness={5} />
							) : (
								value
							)}
						</Typography>
					</CardContent>
				</Card>
				{tooltip && (
					<Box
						alignSelf={'flex-end'}
						ml={-5}
						mb={() => {
							const h = small
								? 150
								: isNumber(height)
								? Number(height)
								: 150
							return h / 10
						}}
					>
						<Tooltip title={tooltip}>
							<IconButton
								aria-label="info"
								sx={{ mb: small ? 0 : 1 }}
								color="secondary"
							>
								<Info />
							</IconButton>
						</Tooltip>
					</Box>
				)}
			</Grid>
		</React.Fragment>
	)
}
