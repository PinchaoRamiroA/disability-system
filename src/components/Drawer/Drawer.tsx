import React from 'react'
import MuiDrawer from '@mui/material/Drawer'
import Divider from '@mui/material/Divider'

import { DrawerHeader } from './DrawerHeader'
import { DrawerList } from './DrawerList'
import { Loader } from '../Loader'

const DrawerListMemo = React.memo(DrawerList)

export const Drawer = ({
	open,
	drawerWidth,
	handleDrawerClose,
}: {
	open: boolean
	drawerWidth: number
	handleDrawerClose: () => void
}) => {
	return (
		<>
			<Loader drawerWidth={open ? drawerWidth : 0} />
			<MuiDrawer
				sx={{
					width: drawerWidth,
					flexShrink: 0,
					'& .MuiDrawer-paper': {
						width: drawerWidth,
						boxSizing: 'border-box',
					},
					display: { xs: 'block', sm: 'none' },
				}}
				variant="temporary"
				anchor="left"
				open={open}
				onClose={handleDrawerClose}
				ModalProps={{
					keepMounted: true, // Better open performance on mobile.
				}}
			>
				<DrawerHeader handleDrawerClose={handleDrawerClose} />
				<Divider />
				<DrawerListMemo />
			</MuiDrawer>
			<MuiDrawer
				sx={{
					width: drawerWidth,
					flexShrink: 0,
					'& .MuiDrawer-paper': {
						width: drawerWidth,
						boxSizing: 'border-box',
					},
					display: { xs: 'none', sm: 'block' },
				}}
				variant="persistent"
				anchor="left"
				open={open}
				onClose={handleDrawerClose}
			>
				<DrawerHeader handleDrawerClose={handleDrawerClose} />
				<Divider />
				<DrawerListMemo />
			</MuiDrawer>
		</>
	)
}
