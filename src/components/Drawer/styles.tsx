import { styled, alpha } from '@mui/material/styles'
import ListItemButton from '@mui/material/ListItemButton'

export const CustomListItemButton = styled(ListItemButton)(
	({ theme }) => ({
		borderRadius: theme.shape.borderRadius,
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
		marginBottom: theme.spacing(1),
		' &&.Mui-selected ': {
			backgroundColor:
				theme.palette.mode === 'dark'
					? theme.palette.secondary.dark
					: alpha(theme.palette.secondary.main, 0.1),
		},
	})
)
