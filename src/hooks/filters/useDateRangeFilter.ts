import { useEffect, useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/hooks/useReduxHooks'
import { filterDatesSelector } from '@/store/slices/Filter'

import { toDate } from 'date-fns-tz'
import { format } from 'date-fns'
import { updateTempFields } from '@/store/slices/Filter/temp_slice'

export const useDateRangeFilter = () => {
  const dispatch = useAppDispatch()

  const { start: selectStart, end: selectEnd } =
    useAppSelector(filterDatesSelector)

  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  useEffect(() => {
    if (selectStart && typeof selectStart === 'string') {
      setStartDate(toDate(selectStart))
    } else {
      setStartDate(null)
    }
  }, [selectStart])

  useEffect(() => {
    if (selectEnd && typeof selectEnd === 'string') {
      setEndDate(toDate(selectEnd))
    } else {
      setEndDate(null)
    }
  }, [selectEnd])

  useEffect(() => {
    if (startDate && endDate) filterDates()
  }, [startDate, endDate])

  const onChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }

  //setea el rango superior al dia actual si el usuario no lo hace
  const handleCalendarClose = () => {
    if (startDate && !endDate) {
      setEndDate(new Date())
    }
  }

  const filterDates = () => {
    if (startDate && endDate) {
      const start = format(startDate, 'yyyy-MM-dd')
      const end = format(endDate, 'yyyy-MM-dd')

      // Actualizar state temporal
      dispatch(updateTempFields({ start, end }))
    }
  }

  return {
    startDate,
    endDate,
    onChange,
    handleCalendarClose,
  }
}
