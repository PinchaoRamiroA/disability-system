import { styled } from '@mui/material/styles'

export const MainWrapper = styled('main')`
	height: 100vh;
	overflow-y: auto;
`

export const SectionWrapper = styled('section', {
	shouldForwardProp: (prop) => prop !== 'open',
})<{
	open: boolean
	drawerwidth: number
}>(({ theme, open, drawerwidth }) => ({
	// backgroundColor: theme.palette.background.paper,
	flexGrow: 1,
	transition: theme.transitions.create('margin', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	marginLeft: 0,
	[theme.breakpoints.up('sm')]: {
		...(open && {
			transition: theme.transitions.create('margin', {
				easing: theme.transitions.easing.easeOut,
				duration: theme.transitions.duration.enteringScreen,
			}),
			marginLeft: `${drawerwidth}px`,
		}),
		padding: theme.spacing(2.5),
		paddingTop: theme.spacing(1.5),
		// paddingInline: theme.spacing(5),
	},
}))

export const TopMargin = styled('div')(({ theme }) => ({
	...theme.mixins.toolbar,
}))
