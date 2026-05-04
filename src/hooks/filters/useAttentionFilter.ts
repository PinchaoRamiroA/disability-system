import React, { useCallback, useEffect, useState } from 'react'
import { filterActionAttention } from '@/store/slices/Filter'
import { updateTempFields } from '@/store/slices/Filter/temp_slice'
import { Attention } from '@/types/Filter/Filter'
import { useAppDispatch, useAppSelector } from '../useReduxHooks'

type AttentionFilter = Attention

const attendedValue: AttentionFilter = {
	checked: true,
	label: 'Chats atendidos',
	value: 'attended',
}

const notAttendedValue: AttentionFilter = {
	checked: false,
	label: 'Chats no atendidos',
	value: 'notAttended',
}

const initialState: AttentionFilter = attendedValue

export const useAttentionFilter = () => {
	const dispatch = useAppDispatch()
	const { attention: attentionFilterValue } = useAppSelector(
		filterActionAttention
	)

	const [attentionState, setAttentionState] =
		useState<AttentionFilter>(initialState)

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.checked) {
			setAttentionState(attendedValue)
		} else {
			setAttentionState(notAttendedValue)
		}
	}

	const filterAttentions = useCallback(() => {
		dispatch(
			updateTempFields({
				attention: attentionState.value,
			})
		)
	}, [dispatch, attentionState])

	useEffect(() => {
		filterAttentions()
	}, [attentionState, filterAttentions])

	useEffect(() => {
		if (attentionFilterValue) {
			if (attentionFilterValue === 'attended') {
				setAttentionState(attendedValue)
			} else {
				setAttentionState(notAttendedValue)
			}
		} else {
			setAttentionState(initialState)
		}
	}, [attentionFilterValue])

	return {
		attentionState,
		handleChange,
	}
}
