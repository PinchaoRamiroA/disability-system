import React from 'react'
import { es as locale } from 'date-fns/locale'

import 'react-datepicker/dist/react-datepicker-cssmodules.css'
import { FilterItem } from '../FilterItem'
import { Picker } from './styles'
import { useDateRangeFilter } from '@/hooks/filters/useDateRangeFilter'
import { FilterClicked } from '@/types/Filter/Filter'

export const DateRangeFilter = ({ clicked }: FilterClicked) => {
	const { startDate, endDate, onChange, handleCalendarClose } =
		useDateRangeFilter()

	return (
		<FilterItem label="Fechas" clicked={clicked}>
			<Picker
				id="date-picker"
				name="datepicker"
				dateFormat="dd MMMM yyyy"
				onChange={onChange}
				showPopperArrow={false}
				popperPlacement="bottom"
				startDate={startDate}
				endDate={endDate}
				selectsRange={true}
				showMonthDropdown
				showYearDropdown
				dropdownMode="select"
				onCalendarClose={handleCalendarClose}
				locale={locale}
				maxDate={new Date()}
				minDate={new Date('2017/01/01')}
			/>
		</FilterItem>
	)
}
