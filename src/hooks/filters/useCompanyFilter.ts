import { useEffect, useState } from 'react'
import { companiesSelector } from '@/store/slices/companies'
import { updateTempFields } from '@/store/slices/Filter/temp_slice'
import { NormalizedCompany } from '@/types/Company'
import { useAppDispatch, useAppSelector } from '../useReduxHooks'
import { filterIdOrgSelector, updateFields } from '@/store/slices/Filter'
import { getVirtualAgents } from '@/store/slices/virtualAgent'

export const useCompanyFilter = () => {
	const dispatch = useAppDispatch()
	const { resource: companies, getStatus: status } =
		useAppSelector(companiesSelector)
	const idOrgSelected = useAppSelector(filterIdOrgSelector)

	const [value, setValue] = useState<NormalizedCompany | null>(null)
	const [inputValue, setInputValue] = useState('')

	const handleChange = (newValue: NormalizedCompany | null) =>
		setValue(newValue)
	const handleSetInputValue = (value: string) => setInputValue(value)

	/**
	 * Seleccionar primera compañía por defecto
	 * @param _dispatch Si es true, hace dispatch del state del filtro global
	 */
	const setDefaultCompany = (_dispatch = false) => {
		setValue(companies[0])

		if (_dispatch) {
			dispatch(updateFields({ idOrg: companies[0].idOrg }))
		}
	}

	// Actualiza el state del filtro temporal
	const filterCompany = () => {
		if (value) {
			dispatch(updateTempFields({ idOrg: value.idOrg }))
		}
		// Valor por defecto (evita que el autocomplete quede en blanco)
		else {
			setDefaultCompany()
		}
	}

	// Definir compañía por defecto
	useEffect(() => {
		if (companies.length) {
			setDefaultCompany()
		}
	}, [companies])

	// Validar que el autocomplete siempre tenga un valor aun si se resetea
	useEffect(() => {
		filterCompany()
		if (value) {
			dispatch(getVirtualAgents(value.idOrg))
		}
	}, [value])

	// Seleccionar compañía por defecto al resetear el filtro
	useEffect(() => {
		setValue(companies.find((item) => item.idOrg === idOrgSelected) ?? null)
		if (!idOrgSelected) {
			if (companies.length) {
				setDefaultCompany(true)
			}
		}
	}, [idOrgSelected])

	return {
		status,
		value,
		handleChange,
		companies,
		inputValue,
		handleSetInputValue,
		setDefaultCompany,
	}
}
