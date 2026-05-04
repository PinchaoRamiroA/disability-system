import {
	filterIdOrgSelector,
	filterLocationsSelector,
	filterSelector,
} from '@/store/slices/Filter'
import { updateTempFields } from '@/store/slices/Filter/temp_slice'
import { locationsSelector } from '@/store/slices/locations'
import { getLocations } from '@/store/slices/locations/actions'
import { City, Department, Region } from '@/types/Locations'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../useReduxHooks'

export function useLocationsFilter(
	requireCities = false,
	requireDepartments = true
) {
	const dispatch = useAppDispatch()
	const idOrg = useAppSelector(filterIdOrgSelector)
	const { resource, getStatus } = useAppSelector(locationsSelector)
	const filterLocationsSel = useAppSelector(filterLocationsSelector)

	// regions: Options del autocomplete de regiones
	const { regions, departments, cities } = resource

	// Valores seleccionados en autocomplete
	const [regionsSelected, setRegionsSelected] = useState<Region[]>([])
	const [departmentsSelected, setDepartmentsSelected] = useState<
		Department[]
	>([])
	const [citiesSelected, setCitiesSelected] = useState<City[]>([])

	// filteredDepartments: Options del autocomplete de departamentos
	const [filteredDepartments, setFilteredDepartments] = useState<
		Department[]
	>([])

	// filteredCities: Options del autocomplete de ciudades
	const [filteredCities, setFilteredCities] = useState<City[]>([])

	// State para controlar la inicialización de departamentos y ciudades
	const [firstLoad, setFirstLoad] = useState(true)
	const [firstLoadCities, setFirstLoadCities] = useState(true)

	// Estado completo del filtro (necesario para resetear campos)
	const {
		regionals: stateRegs,
		departments: stateDepts,
		cities: stateCities,
	} = useAppSelector(filterSelector)

	// Actualiza valores seleccionados en autocomplete
	const handleRegionsSelected = (value: Region[]) => setRegionsSelected(value)
	const handleDepartmentsSelected = (value: Department[]) =>
		setDepartmentsSelected(value)
	const handleCitiesSelected = (value: City[]) => setCitiesSelected(value)

	// Actualizar state.filter
	const filterLocations = () => {
		dispatch(
			updateTempFields({
				regionals: regionsSelected.map((region) => region.id),
				departments: departmentsSelected.map((depto) => depto.id),
				cities: citiesSelected.map((city) => city.id),
			})
		)
	}

	const initRegions = () => {
		// Cargar regiones guardadas en state
		if (regions.length && filterLocationsSel.regions) {
			const temp: Region[] = []
			regions.forEach((reg) => {
				if (filterLocationsSel.regions?.includes(reg.id)) {
					temp.push(reg)
				}
			})

			handleRegionsSelected(temp)
		}
	}

	const initDepartments = () => {
		if (departments.length && filterLocationsSel.departments?.length) {
			const temp: Department[] = []
			departments.forEach((dept) => {
				if (filterLocationsSel.departments?.includes(dept.id)) {
					temp.push(dept)
				}
			})

			handleDepartmentsSelected(temp)
		}
	}

	const initCities = () => {
		if (
			requireCities &&
			cities.length &&
			filterLocationsSel.cities?.length
		) {
			const temp: City[] = []
			cities.forEach((city) => {
				if (filterLocationsSel.cities?.includes(city.id)) {
					temp.push(city)
				}
			})

			handleCitiesSelected(temp)
		}
	}

	useEffect(() => {
		initRegions()
	}, [])

	useEffect(() => {
		if (idOrg) {
			dispatch(getLocations({ idOrg, requireCities }))
		}
	}, [idOrg, requireCities])

	// Cargar departamentos cada vez que se cambie de región
	useEffect(() => {
		if (requireDepartments) {
			const prevValues: Department[] = []
			const newValues: Department[] = []

			regionsSelected.forEach((region) => {
				// Valores previos
				departmentsSelected.forEach((dept) => {
					if (dept.idRegional === region.id) prevValues.push(dept)
				})

				// Nuevos valores
				departments.forEach((dept) => {
					if (dept.idRegional === region.id) newValues.push(dept)
				})
			})

			// Actualizar valores de autocomplete, manteniendo los departamentos que se habían seleccionado
			handleDepartmentsSelected(prevValues)

			// Inicializar departamentos (componente recién montado)
			if (firstLoad) {
				initDepartments()
				setFirstLoad(false)
			}

			// Departamentos disponibles para seleccionar
			setFilteredDepartments(newValues)
		}
	}, [regionsSelected])

	// Cargar ciudades cada vez que se cambie de departamento
	useEffect(() => {
		const prevValues: City[] = []
		const newValues: City[] = []

		departmentsSelected.forEach((dept) => {
			// Valores previos
			citiesSelected.forEach((city) => {
				if (city.idDepartment == dept.id) prevValues.push(city)
			})

			// Nuevos valores
			cities.forEach((city) => {
				if (city.idDepartment == dept.id) newValues.push(city)
			})
		})

		// Actualizar valores de autocomplete, manteniendo las ciudades que se habían seleccionado
		handleCitiesSelected(prevValues)

		// Inicializar ciudades (componente recién montado)
		if (firstLoadCities) {
			initCities()
			setFirstLoadCities(false)
		}

		// Ciudades disponibles para seleccionar
		setFilteredCities(newValues)
	}, [departmentsSelected])

	// Actualizar state temporal del filtro cuando se seleccionen regiones, departamentos o ciudades
	useEffect(() => {
		filterLocations()
	}, [regionsSelected, departmentsSelected, citiesSelected])

	// Resetear filtro: Limpiar valores del autocomplete
	useEffect(() => {
		if (!(stateRegs || stateDepts || stateCities)) {
			handleRegionsSelected([])
		}
	}, [stateRegs, stateDepts, stateCities])

	return {
		status: getStatus,
		regions,
		regionsSelected,
		handleRegionsSelected,
		departments: filteredDepartments,
		departmentsSelected,
		handleDepartmentsSelected,
		cities: filteredCities,
		citiesSelected,
		handleCitiesSelected,
	}
}
