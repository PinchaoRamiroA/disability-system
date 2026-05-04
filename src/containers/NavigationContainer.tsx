import React, { useEffect } from 'react'
import { Appbar } from '@/components/Appbar'
import { Drawer } from '@/components/Drawer'
import { Main } from '@/components/Main'
import LoadingBar from 'react-redux-loading-bar'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material'
import { Theme } from '@mui/material/styles'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import { setOpen, drawerSelector } from '@/store/slices/drawer'

export const NavigationContainer = ({
	children,
}: {
	children: React.ReactNode
}) => {
	const dispatch = useAppDispatch()
	const { open, drawerWidth } = useAppSelector(drawerSelector)

	const theme: Theme = useTheme()
	const handleDrawerToggle = () => {
		dispatch(setOpen({ open: !open }))
	}

	const handleDrawerClose = () => {
		dispatch(setOpen({ open: false }))
	}

	useEffect(() => {
		const savedDrawerState = localStorage.getItem('drawerState')
		if (savedDrawerState !== null) {
			dispatch(setOpen({ open: JSON.parse(savedDrawerState) }))
		}
	}, [dispatch])

	// Guardar estado del Drawer en localStorage cada vez que se abre/cierra
	useEffect(() => {
		localStorage.setItem('drawerState', JSON.stringify(open))
	}, [open])

	return (
		<>
			<Box
				sx={{
					zIndex: (_theme) => ({ sm: _theme.zIndex.drawer + 2 }),
					width: '100%',
					position: 'absolute',
				}}
			>
				<LoadingBar style={{ backgroundColor: theme.status.main }} />
			</Box>
			<Appbar handleDrawerToggle={handleDrawerToggle} />
			<Drawer
				drawerWidth={drawerWidth ?? 0}
				open={open}
				handleDrawerClose={handleDrawerClose}
			/>
			<Main drawerWidth={drawerWidth ?? 0} open={open}>
				{children}
			</Main>
		</>
	)
}
