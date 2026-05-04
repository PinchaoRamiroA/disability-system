import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useCompanyAndIdVa } from '@/hooks/useCompanyAndIdVa'
import { useLoading } from '@/hooks/useLoading'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import {
	formularioEntradaSelector,
	getFormEntrada,
	sortFormEntrada,
	updateFormEntradaField,
} from '@/store/slices/settings/asistente-virtual'
import { GridContainer } from '@/components/GridContainer'
import { userSelector } from '@/store/slices/authentication'
import { ADMIN_ROLE, SUPERADMIN_ROLE } from '@/utils/constants/roles'
import { CompanyFilter } from '@/components/Filter/FilterDrawer/FilterItem/CompanyFilter'
import { VirtualAgentFilter } from '@/components/Filter/FilterDrawer/FilterItem/VirtualAgentFilter'
import { Grid, Paper } from '@mui/material'
import { GridDivider } from '@/components/GridDivider'
import {
	FormConfigMode,
	FormEntrada,
	FormEntradaFieldAction,
	FormEntradaUpdate,
} from '@/types/Settings/asistente-virtual/FormularioEntrada'
import {
	FormEntradaContext,
	FormEntradaContextType,
} from './FormEntradaContext'
import { RenderActiveFields } from './RenderActiveFields'
import { RenderInactiveFields } from './RenderInactiveFields'
import {
	closestCorners,
	DndContext,
	DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	TouchSensor,
	UniqueIdentifier,
	useSensor,
	useSensors,
} from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { FormPreview } from './FormPreview'
import { ConfigMode } from './ConfigMode'

export const FormularioEntradaContainer = () => {
	const dispatch = useAppDispatch()
	const { idOrg, idVa } = useCompanyAndIdVa()
	const { startLoading, stopLoading } = useLoading()
	const { role } = useAppSelector(userSelector)

	// Reducer
	const { resource } = useAppSelector(formularioEntradaSelector)
	// Campos activos que se muestran en los pasos del formulario
	const [activeFields, setActiveFields] = useState<FormEntrada[][]>([])
	const [flatActiveFields, setFlatActiveFields] = useState<FormEntrada[]>([])
	const [sortForm, setSortForm] = useState(false)
	// Campos inactivos que se muestran en la parte inferior de la pantalla
	const [inactiveFields, setInactiveFields] = useState<FormEntrada[]>([])
	// Modo de configuración
	const [mode, setMode] = useState<FormConfigMode>('add-remove')
	// Referencia para desplazamiento de scroll
	const refContainer = useRef<HTMLDivElement>(null)

	/**
	 * State que indica que se está arrastrando un objeto
	 */
	const [isGrabbing, setIsGrabbing] = useState(false)

	const scrollToEnd = () => {
		if (refContainer.current) {
			refContainer.current.scrollIntoView({
				behavior: 'smooth', // 'instant' issue: https://github.com/Microsoft/TypeScript/issues/28755
				block: 'nearest',
			})
		}
	}

	/**
	 * Sensores para Dnd
	 */
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(TouchSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	)

	// Agregar/Quitar campo del formulario de entrada
	const handleUpdateField = useCallback(
		(field: FormEntradaUpdate | null, action: FormEntradaFieldAction) => {
			if (field) {
				startLoading()

				const isActive =
					action === 'add'
						? true
						: action === 'remove'
						? false
						: field.isActive

				dispatch(
					updateFormEntradaField({
						idOrg,
						idVa,
						payload: [
							{
								...field,
								label: field.label.trim(),
								isActive,
							},
						],
					})
				).then(stopLoading)
			}
		},
		[dispatch, idOrg, idVa, startLoading, stopLoading]
	)

	const splitActiveFields = (actives: FormEntrada[]) => {
		// Separar campos de 3 en 3 ya que hay más de 1 paso
		const chunks: FormEntrada[][] = []
		// El formulario e separa en grupos de 3 campos, excepto el paso 1 que debe tener 2
		let chunkSize = 2

		// Iterar sobre el array original en pasos de chunkSize
		for (let i = 0; i < actives.length; ) {
			// Extraer un chunk del array original y añadirlo al array de chunks
			const chunk = actives.slice(i, i + chunkSize)
			chunks.push(chunk)

			i += chunkSize

			// Iniciar separación de 3 campos después del paso 1
			if (chunks.length === 1) {
				chunkSize = 3
			}
		}

		setActiveFields(chunks)
	}

	// Llamar action para obtener configuración actual del formulario de entrada
	useEffect(() => {
		if (idOrg && idVa) {
			startLoading()
			dispatch(getFormEntrada({ idOrg, idVa })).then(stopLoading)
		}
	}, [idOrg, idVa])

	// Recalcular pasos del formulario cada vez que se actualiza el reducer
	useEffect(() => {
		const actives: FormEntrada[] = []
		const inactives: FormEntrada[] = []

		// Separar campos activos de inactivos
		resource.forEach((field) => {
			let defaultText: string | undefined
			let editable = false

			if (field.name === 'checkTextHabeasData') {
				editable = true
				defaultText = `
					Autorizo a Colmena Seguros para el tratamiento de mis datos personales, conforme a las Políticas de Tratamiento De Datos Personales que se encuentran a mi disposición y podrán ser consultadas en la [página web](https://www.colmenaseguros.com/legal/politicas-de-proteccion-de-datos).
				`
			} else if (field.name === 'generalTextHabeasData') {
				editable = true
				defaultText = `
					Antes de iniciar nuestra conversación y buscando garantizarte la seguridad de la información agradezco nos brindes la autorización del tratamiento de tus datos personales.
				`
			}

			if (field.isActive) {
				actives.push({
					...field,
					defaultText,
					editable,
				})
			} else {
				inactives.push({
					...field,
					defaultText,
					editable,
				})
			}
		})

		setFlatActiveFields(actives)
		splitActiveFields(actives)

		// Actualizar valores del autocomplete con los campos inactivos
		setInactiveFields(inactives)
	}, [resource])

	useEffect(() => {
		scrollToEnd()
	}, [handleUpdateField])

	const formEntradaContextValue = useMemo<FormEntradaContextType>(
		() => ({
			handleUpdateField,
			isGrabbing,
			mode,
		}),
		[handleUpdateField, isGrabbing, mode]
	)

	/**
	 * Lógica Drag & Drop
	 */
	const getFieldPos = (id: UniqueIdentifier) =>
		activeFields.flat().findIndex((field) => field.name === id)

	// Agarrar elemento
	const handleDragStart = () => {
		setIsGrabbing(true)
	}

	// Soltar elemento
	const handleDragEnd = (event: DragEndEvent) => {
		setIsGrabbing(false)

		const { active, over } = event

		if (active.id === over?.id) return

		if (over) {
			// Guardar estado anterior
			setFlatActiveFields((fields) => {
				const originalPos = getFieldPos(active.id)
				const newPos = getFieldPos(over.id)

				return arrayMove(fields, originalPos, newPos)
			})
			setSortForm(true)
		}
	}

	useEffect(() => {
		if (sortForm && idOrg && idVa) {
			// El payload son los campos activos y los campos inactivos
			setSortForm(false)
			startLoading()
			dispatch(
				sortFormEntrada({
					idOrg,
					idVa,
					payload: flatActiveFields.concat(inactiveFields),
				})
			).then(stopLoading)
		}
		splitActiveFields(flatActiveFields)
	}, [flatActiveFields, idOrg, idVa, dispatch, sortForm, inactiveFields])

	return (
		<DndContext
			collisionDetection={closestCorners}
			onDragEnd={handleDragEnd}
			sensors={sensors}
			onDragStart={handleDragStart}
		>
			<FormEntradaContext.Provider value={formEntradaContextValue}>
				<GridContainer>
					{/* Filtro de organización y asistente virtual */}
					<Grid container item xs gap={2} justifyContent="flex-start">
						{role === SUPERADMIN_ROLE && (
							<Grid item xs sm={6} md={4}>
								<Paper elevation={0}>
									<CompanyFilter settings />
								</Paper>
							</Grid>
						)}
						{(role === SUPERADMIN_ROLE || role === ADMIN_ROLE) && (
							<Grid item xs sm={6} md={4}>
								<Paper elevation={0}>
									<VirtualAgentFilter settings />
								</Paper>
							</Grid>
						)}
					</Grid>
					<GridDivider my={1} padding={false} />

					{/* Campos y previsualización*/}
					<GridContainer item>
						{/* Previsualización del formulario */}
						<Grid
							item
							xs={12}
							md={7}
							sx={() => ({
								position: { md: 'sticky' }, // Aplicar `sticky` solo para pantallas md o superiores
								top: { md: '4rem' }, // Aplicar `top` solo para pantallas md o superiores
								alignSelf: { md: 'flex-start' }, // Aplicar `alignSelf` solo para pantallas md o superiores
							})}
						>
							<FormPreview fields={activeFields} />
						</Grid>

						{/* Campos */}
						<Grid item xs={12} md={5}>
							{/* Elegir modo de configuración */}
							<ConfigMode mode={mode} setMode={setMode} />

							{activeFields.length > 0 && (
								<RenderActiveFields fields={activeFields} />
							)}

							{/* Mostrar contenido de campos inactivos si los hay */}
							{mode === 'add-remove' &&
								inactiveFields.length > 0 && (
									<RenderInactiveFields
										fields={inactiveFields}
									/>
								)}
						</Grid>
					</GridContainer>
				</GridContainer>
			</FormEntradaContext.Provider>
		</DndContext>
	)
}
