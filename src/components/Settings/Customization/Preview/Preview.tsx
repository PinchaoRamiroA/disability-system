import React, { useEffect } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import { PreviewContainer } from './styles'
import { AsesorTab } from './DashboardTabs/AsesorTab'
import { DashboardTab } from './DashboardTabs/DashboardTab'
import { usePreviewTabsContext } from '@/hooks/contexts/usePreviewTabsContext'
import { ThemeProvider } from '@mui/material'
import { useDefinePreviewTheme } from '@/hooks/useDefinePreviewTheme'
import { useFontContext } from '@/hooks/useFontContext'
import { useImportGoogleFont } from '@/hooks/settings/useImportGoogleFont'
import { IsWidgetConfig } from '@/types/Settings/General/Dashboard'
import { FormTab } from './WidgetTabs/FormTab'
import { ChatTab } from './WidgetTabs/ChatTab'
import { PopupTab } from './WidgetTabs/PopupTab'
import { useDefinePreviewWidgetTheme } from '@/hooks/useDefinePreviewWidgetTheme'

interface TabPanelProps {
	children?: React.ReactNode
	index: number
	value: number
}

function CustomTabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && <Box>{children}</Box>}
		</div>
	)
}

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	}
}

export const Preview = ({ widget }: IsWidgetConfig) => {
	const themeDashboard = useDefinePreviewTheme()
	const themeWidget = useDefinePreviewWidgetTheme()

	const { tab, setTab } = usePreviewTabsContext()
	const { importFamily } = useImportGoogleFont()
	const { fontSelected } = useFontContext()

	const handleChange = (_: React.SyntheticEvent, newValue: number) => {
		document.head.appendChild
		setTab(newValue)
	}

	useEffect(() => {
		if (fontSelected) {
			importFamily(fontSelected.family)
		}
	}, [fontSelected])

	return (
		<PreviewContainer>
			<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
				{widget ? (
					<Tabs
						value={tab}
						onChange={handleChange}
						aria-label="basic tabs example"
					>
						<Tab label="Formulario Widget" {...a11yProps(0)} />
						<Tab label="Chat" {...a11yProps(1)} />
						<Tab label="Popups" {...a11yProps(2)} />
					</Tabs>
				) : (
					<Tabs
						value={tab}
						onChange={handleChange}
						aria-label="basic tabs example"
					>
						<Tab label="Dashboard" {...a11yProps(0)} />
						<Tab label="Asesor humano" {...a11yProps(1)} />
					</Tabs>
				)}
			</Box>
			<ThemeProvider theme={widget ? themeWidget : themeDashboard}>
				{widget ? (
					<>
						<CustomTabPanel value={tab} index={0}>
							<FormTab />
						</CustomTabPanel>
						<CustomTabPanel value={tab} index={1}>
							<ChatTab />
						</CustomTabPanel>
						<CustomTabPanel value={tab} index={2}>
							<PopupTab />
						</CustomTabPanel>
					</>
				) : (
					<>
						<CustomTabPanel value={tab} index={0}>
							<DashboardTab />
						</CustomTabPanel>
						<CustomTabPanel value={tab} index={1}>
							<AsesorTab />
						</CustomTabPanel>
					</>
				)}
			</ThemeProvider>
		</PreviewContainer>
	)
}
