import { useEffect, useState } from 'react'
import {
	documentTypesSelector,
	getDocumentTypes,
} from '@/store/slices/documentTypes'
import { filterSelector, filterUserSelector } from '@/store/slices/Filter'
import { NormalizedDocumentType } from '@/types/Filter/DocumentTypes'
import { useAppDispatch, useAppSelector } from '../useReduxHooks'
import {
	filterTempSelector,
	updateTempFields,
} from '@/store/slices/Filter/temp_slice'
import { useCompanyAndIdVa } from '../useCompanyAndIdVa'
import { locationsFilters } from '@/utils/helpers/locationsFilters'

export const useUserIdFilter = () => {
	const dispatch = useAppDispatch()
	const user = useAppSelector(filterUserSelector)
	const { idOrg } = useCompanyAndIdVa()
	const { resource: documentTypes, getStatus: status } = useAppSelector(
		documentTypesSelector
	)

	// Textbox Número de documento
	const [userId, setUserId] = useState<string | undefined>(undefined)

	// Tipo de documento
	const [value, setValue] = useState<NormalizedDocumentType | null>(
		documentTypes[0]
	)
	const [inputValue, setInputValue] = useState('')

	// Estado completo del filtro (necesario para resetear campos)
	const { id: stateId, idType: stateIdType } = useAppSelector(filterSelector)
	const { idVa, regionals, departments, start, end } =
		useAppSelector(filterTempSelector)

	// Recuperar valores del state si este no se ha modificado
	useEffect(() => {
		if (user.id && user.idType) {
			setUserId(user.id)
			setValue({ id: user.idType, label: user.idType })
		}
	}, [])

	// Cargar tipos de documento cada vez que la fechas cambien
	useEffect(
		function loadDocumentTypes() {
			// Cargar tipos de documento
			if (idOrg && start && end && idVa) {
				const { idDepartments, idRegionals } = locationsFilters(
					regionals,
					departments
				)

				resetValues()
				dispatch(
					getDocumentTypes({
						idOrg,
						filters: {
							start,
							end,
							idDepartments,
							idRegionals,
							idVa,
						},
					})
				)
			}
		},
		[
			idOrg,
			start,
			end,
			idVa,
			regionals?.toString(),
			departments?.toString(),
		]
	)

	// Actualizar temp state cuando se selecciona un tipo de documento
	useEffect(() => {
		filterUsers()
	}, [userId, value])

	// Resetea valores de textfield cuando se resetean los filtros
	useEffect(() => {
		if (!(stateId || stateIdType)) {
			resetValues(true)
		}
	}, [stateId, stateIdType])

	const handleChangeUserId = (value: string) => setUserId(value)
	const handleSetValue = (value: NormalizedDocumentType | null) =>
		setValue(value)
	const handleSetInputValue = (value: string) => setInputValue(value)

	const filterUsers = () => {
		if (userId && value?.id) {
			dispatch(updateTempFields({ id: userId, idType: value?.id }))
		} else {
			dispatch(updateTempFields({ id: undefined, idType: undefined }))
		}
	}

	const resetValues = (resetUserId = false) => {
		if (resetUserId) {
			setUserId(undefined)
		}

		// Limpiar autocomplete antes de hacer el servicio
		setValue(null)
		setInputValue('')

		filterUsers()
	}

	return {
		status,
		userId,
		handleChangeUserId,
		documentTypes,
		value,
		inputValue,
		handleSetValue,
		handleSetInputValue,
	}
}
