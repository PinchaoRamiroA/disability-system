import { styled } from '@mui/system'
import { Theme } from '@mui/material/styles'
import { CONTAINER_HEIGHT_CALC } from '@/utils/constants/containerHeight'

export const PreviewContainer = styled('div')<{ theme?: Theme }>(
	({ theme }) => ({
		position: 'sticky',
		height: `calc(${CONTAINER_HEIGHT_CALC} + 9px)`,
		padding: theme.spacing(0, 1),
		// necessary for content to be below app bar
		top: 70,
		backgroundColor: 'white',
	})
)
