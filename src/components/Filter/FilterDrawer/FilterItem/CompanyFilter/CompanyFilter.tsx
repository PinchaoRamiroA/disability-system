import { Grid } from '@mui/material'
import { useCompanyFilter } from '@/hooks/filters/useCompanyFilter'
import { FilterItem } from '../FilterItem'
import { CompanyAutocomplete } from './CompanyAutocomplete'
import { FilterClicked } from '@/types/Filter/Filter'

interface Props extends FilterClicked {
	settings?: boolean
}

export const CompanyFilter = ({ settings = false, clicked }: Props) => {
	const {
		status,
		value,
		handleChange,
		companies,
		inputValue,
		handleSetInputValue,
		setDefaultCompany,
	} = useCompanyFilter()

	if (settings) {
		return (
			// <Paper elevation={0}>
			// </Paper>
			<CompanyAutocomplete
				companies={companies}
				handleChange={handleChange}
				handleSetInputValue={handleSetInputValue}
				inputValue={inputValue}
				value={value}
				settings
				setDefaultCompany={setDefaultCompany}
			/>
		)
	}

	return (
		<>
			{companies.length < 2 ? (
				<></>
			) : (
				<FilterItem label="Compañía" status={status} clicked={clicked}>
					<Grid container>
						<CompanyAutocomplete
							companies={companies}
							handleChange={handleChange}
							handleSetInputValue={handleSetInputValue}
							inputValue={inputValue}
							value={value}
						/>
					</Grid>
				</FilterItem>
			)}
		</>
	)
}
