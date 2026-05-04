import React from 'react'
import { WidgetPickers } from './Widget'
import { DashboardPickers } from './Dashboard'
import { FontContextType } from '@/contexts/FontContext'
interface Props extends FontContextType {
	widget?: boolean
}

export const Pickers = ({ widget, ...rest }: Props) => {
	return widget ? <WidgetPickers {...rest} /> : <DashboardPickers {...rest} />
}
