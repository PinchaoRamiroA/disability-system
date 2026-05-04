import React, { useEffect, useState } from 'react'
import { CompanyFilter } from '@/components/Filter/FilterDrawer/FilterItem/CompanyFilter'
import { Preview } from '@/components/Settings/Customization/Preview'
import { PreviewTabsContext } from '@/contexts/PreviewTabsContext'
import { useFontConfigState } from '@/hooks/settings/useFontConfigState'
import { useCompanyAndIdVa } from '@/hooks/useCompanyAndIdVa'
import { useLoading } from '@/hooks/useLoading'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import { userSelector } from '@/store/slices/authentication'
import {
	updateDashboardConfig,
	updateDashboardLogo,
} from '@/store/slices/dashboard-config'
import { updateDashboardPreview } from '@/store/slices/dashboard-config-preview'
import { uploadFileAction } from '@/store/slices/uploadFile'
import { UpdateDashboardConfigPayload } from '@/types/Settings/General/Dashboard'
import { ADMIN_ROLE, SUPERADMIN_ROLE } from '@/utils/constants/roles'
import { dashboardColorsDifference } from '@/utils/helpers/colorsDifference'
import { Button, Grid, Paper } from '@mui/material'
import { FontContext } from '@/contexts/FontContext'
import { fileToBase64 } from '@/utils/helpers/fileToBase64'
import { Pickers } from '@/components/Settings/Customization/Pickers'
import { useDashboardConfigSelectors } from '@/hooks/settings/useDashboardConfigSelectors'
import { useWidgetConfigSelectors } from '@/hooks/settings/useWidgetConfigSelectors'
import {
	updateWidgetAvatar,
	updateWidgetConfig,
} from '@/store/slices/widgetConfig'
import { updateWidgetPreview } from '@/store/slices/widget-config-preview'
import { VirtualAgentFilter } from '@/components/Filter/FilterDrawer/FilterItem/VirtualAgentFilter'
import useNotifier from '@/hooks/useNotifier'

interface Props {
	widget?: boolean
}

export const PersonalizacionContainer = ({ widget = false }: Props) => {
	const dispatch = useAppDispatch()
	const { startLoading, stopLoading } = useLoading()
	const { enqueueSnackbar } = useNotifier()

	const { role } = useAppSelector(userSelector)
	const { idOrg, idVa } = useCompanyAndIdVa()
	const [tab, setTab] = useState(0)

	const {
		fontSelected,
		fontStyles,
		fontVariant,
		setFontSelected,
		setFontStyles,
		setFontVariant,
		setFont,
	} = useFontConfigState()

	const { estilosDashboard, logoDashboard, coloresDashboard } =
		useDashboardConfigSelectors()
	const { estilosWidget, logoWidget, coloresWidget } =
		useWidgetConfigSelectors()

	const handleDiscard = () => {
		if (widget) {
			dispatch(updateWidgetPreview(estilosWidget))
		} else {
			dispatch(updateDashboardPreview(estilosDashboard))
		}
	}

	const handleUpdate = async () => {
		if (idOrg) {
			if (idVa) {
				// Actualizar logo
				const logo = widget ? logoWidget : logoDashboard
				if (logo.file) {
					startLoading()

					// Obtener referencia
					const bas = await fileToBase64(logo.file)
					await dispatch(
						uploadFileAction({
							base64: bas,
							contentType: logo.file.type,
							callback: (data) => {
								// Subir imagen
								if (widget) {
									dispatch(
										updateWidgetAvatar({
											idOrg,
											payload: {
												idVa,
												nameImage: data.url,
											},
										})
									)
								} else {
									dispatch(
										updateDashboardLogo({
											idOrg,
											payload: {
												nameImage: data.url,
											},
										})
									)
								}
							},
						})
					)
					stopLoading()
				}

				// Actualizar widget
				if (widget) {
					// Actualizar widget
					if (fontSelected) {
						dispatch(
							updateWidgetConfig({
								idOrg,
								payload: {
									// ...WIDGET_CONFIG_DEFAULT,
									colores: coloresWidget,
									font: {
										category: fontSelected.category,
										family: fontSelected.family,
										variant: fontVariant,
									},
									idVa,
									idOrg,
								},
							})
						)
					}
				} else {
					// Actualizar colores y fuente
					const updateColores = dashboardColorsDifference(
						estilosDashboard.colores,
						coloresDashboard
					)
					const payloadDashboard: UpdateDashboardConfigPayload = {}

					// Se escogió una fuente
					if (fontSelected) {
						payloadDashboard.fuente = {
							category: fontSelected.category,
							family: fontSelected.family,
							variant: fontVariant,
						}
					}
					// Se modificó por lo menos un color
					if (Object.entries(updateColores).length) {
						payloadDashboard.colores = updateColores
					}

					// El payload no está vacío
					if (Object.entries(payloadDashboard).length) {
						startLoading()
						await dispatch(
							updateDashboardConfig({
								idOrg,
								// payload: DASHBOARD_DEFAULT_CONFIG,
								payload: payloadDashboard,
							})
						)
						stopLoading()
					}
				}
			} else {
				enqueueSnackbar(
					'No se pueden guardar los cambios ya que no se encontró un asistente virtual asociado. Comunícate con un administrador.',
					{ variant: 'warning', autoHideDuration: null }
				)
			}
		}
	}

	useEffect(() => {
		if (widget) {
			setFont(estilosWidget.font)
		} else {
			setFont(estilosDashboard.fuente)
		}
	}, [estilosDashboard, estilosWidget])

	useEffect(() => {
		stopLoading()
	}, [])

	return (
		<React.Fragment>
			<PreviewTabsContext.Provider value={{ setTab, tab }}>
				<Grid container>
					{/* Formulario de envío */}
					<Grid container item px={3} xs gap={2}>
						{/* Filtro de organización */}
						{role === SUPERADMIN_ROLE && (
							<Grid item xs>
								<Paper elevation={0}>
									<CompanyFilter settings />
								</Paper>
							</Grid>
						)}
						{/* Filtro de agentes virtuales (solo para widget) */}
						{widget &&
							(role === SUPERADMIN_ROLE ||
								role === ADMIN_ROLE) && (
								<Grid item xs>
									<Paper elevation={0}>
										<VirtualAgentFilter settings />
									</Paper>
								</Grid>
							)}
					</Grid>
					<Grid item xs textAlign="end">
						<Button
							variant="outlined"
							sx={{ mr: 2 }}
							onClick={handleDiscard}
						>
							Descartar cambios
						</Button>
						<Button
							variant="contained"
							onClick={handleUpdate}
							color="primary"
						>
							Guardar cambios
						</Button>
					</Grid>
				</Grid>

				{/* Panel izquierdo y preview */}
				<Grid container gap={2} mt={2}>
					<Grid item xs="auto" px={3}>
						{/* Se pasan fuentes como props porque internamente se encuentra el selector de fuentes, pero si se usara en el context FontContext, el cambio de fuente afecta componentes afuera del Preview */}
						<Pickers
							fontSelected={fontSelected}
							fontVariant={fontVariant}
							setFontSelected={setFontSelected}
							setFontStyles={setFontStyles}
							setFontVariant={setFontVariant}
							fontStyles={fontStyles}
							widget={widget}
						/>
					</Grid>

					{/* Preview */}
					<Grid item xs>
						{/* FontContext se usa solo en el preview */}
						<FontContext.Provider
							value={{
								fontSelected,
								fontVariant,
								setFontSelected,
								setFontStyles,
								setFontVariant,
								fontStyles,
							}}
						>
							<Preview widget={widget} />
						</FontContext.Provider>
					</Grid>
				</Grid>
			</PreviewTabsContext.Provider>
		</React.Fragment>
	)
}
