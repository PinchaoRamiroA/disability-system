import { useVirtualAgentFilter } from '@/hooks/filters/useVirtualAgentFilter'
import { Grid } from '@mui/material'
import React from 'react'
import { FilterItem } from '../FilterItem'
import { VirtualAgentAutocomplete } from './VirtualAgentAutocomplete'
import { FilterClicked } from '@/types/Filter/Filter'

interface Props extends FilterClicked {
	settings?: boolean
}

export const VirtualAgentFilter = ({ settings = false, clicked }: Props) => {
	const {
		status,
		agents,
		value,
		inputValue,
		handleChange,
		handleSetInputValue,
		setDefaultAgent,
	} = useVirtualAgentFilter()

	if (settings) {
		return (
			// <Paper elevation={0}>
			// </Paper>
			<VirtualAgentAutocomplete
				agents={agents}
				handleChange={handleChange}
				handleSetInputValue={handleSetInputValue}
				inputValue={inputValue}
				value={value}
				settings
				setDefaultAgent={setDefaultAgent}
			/>
		)
	}

	return (
		<React.Fragment>
			{agents.length < 2 ? (
				<></>
			) : (
				<FilterItem
					label="Asesor virtual"
					status={status}
					clicked={clicked}
				>
					<Grid container>
						<VirtualAgentAutocomplete
							agents={agents}
							handleChange={handleChange}
							handleSetInputValue={handleSetInputValue}
							inputValue={inputValue}
							value={value}
						/>
					</Grid>
				</FilterItem>
			)}
		</React.Fragment>
	)
}
