import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../useReduxHooks'
import { useCompanyAndIdVa } from '../useCompanyAndIdVa'
import {
	getWidgetAvatar,
	getWidgetConfig,
	widgetAvatarSelector,
	widgetConfigSelector,
} from '@/store/slices/widgetConfig'
import {
	updateWidgetPreview,
	widgetPreviewSelector,
} from '@/store/slices/widget-config-preview'

export const useWidgetConfigSelectors = () => {
	const dispatch = useAppDispatch()
	const { idOrg, idVa } = useCompanyAndIdVa()
	const { resource: estilos } = useAppSelector(widgetConfigSelector)
	const { resource: avatar } = useAppSelector(widgetAvatarSelector)
	const { colores } = useAppSelector(widgetPreviewSelector)

	// const handleUpdate = async () => {
	// 	if (idOrg && idVa) {
	// 		// Actualizar avatar
	// 		// Obtener referencia
	// 		if (avatar.file) {
	// 			const bas = await fileToBase64(avatar.file)
	// 			dispatch(
	// 				uploadFileAction({
	// 					base64: bas,
	// 					contentType: avatar.file.type,
	// 					callback: (data) => {
	// 						// Subir imagen
	// 						dispatch(
	// 							updateWidgetAvatar({
	// 								idOrg,
	// 								payload: {
	// 									idVa,
	// 									nameImage: data.url,
	// 								},
	// 							})
	// 						)
	// 					},
	// 				})
	// 			)
	// 		}

	// 		// Actualizar colores
	// 		if (fontSelected) {
	// 			dispatch(
	// 				updateWidgetConfig({
	// 					idOrg,
	// 					payload: {
	// 						colores: getColors(),
	// 						font: {
	// 							category: fontSelected.category,
	// 							family: fontSelected.family,
	// 							variant: fontVariant,
	// 						},
	// 						idVa,
	// 						idOrg,
	// 					},
	// 				})
	// 			)
	// 		}
	// 	}
	// }

	useEffect(() => {
		dispatch(updateWidgetPreview(estilos))
	}, [estilos])

	useEffect(() => {
		if (idOrg && idVa) {
			dispatch(
				getWidgetConfig({
					idOrg,
					idVa,
				})
			)

			dispatch(
				getWidgetAvatar({
					idOrg,
					idVa,
				})
			)
		}
	}, [idOrg, idVa])

	return {
		estilosWidget: estilos,
		logoWidget: avatar,
		coloresWidget: colores,
	}
}
