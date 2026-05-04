import React from 'react'
import { MainWrapper, SectionWrapper, TopMargin } from './styles'
import { CustomBreadcrumbs } from '../Navigation/CustomBreadcrumbs'

export const Main = ({
	open,
	drawerWidth,
	children,
}: {
	open: boolean
	drawerWidth: number
	children: React.ReactNode
}) => {
	return (
		<MainWrapper>
			<TopMargin />
			<SectionWrapper drawerwidth={drawerWidth} open={open}>
				<CustomBreadcrumbs />
				{children}
			</SectionWrapper>
		</MainWrapper>
	)
}
