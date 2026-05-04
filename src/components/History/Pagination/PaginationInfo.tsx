import React from 'react'
import { Button, Grid } from '@mui/material'
import { useAppSelector } from '@/hooks/useReduxHooks'
import { filterSelector } from '@/store/slices/Filter'
import { useCompanyAndIdVa } from '@/hooks/useCompanyAndIdVa'
import { useSnackbar } from 'notistack'
import { getFileFailed } from '@/utils/constants/snackbars/files'
import { useLoading } from '@/hooks/useLoading'
import {
	getNotAttendedCsvFile,
	getHistoryReferenceFile,
} from '@/services/api/reports'
import { useDownloadFile } from '@/hooks/useDownloadFile'
import fileDownload from 'js-file-download'
import { AttentionValue } from '@/types/Filter/Filter'
import { detectUnauthorizedPromise } from '@/utils/helpers/detectUnauthorized'
import moment from 'moment'

interface Props {
	currentResults: number
	totalResults: number
	attention?: AttentionValue
}

export const PaginationInfo = ({
	currentResults,
	totalResults,
	attention,
}: Props) => {
	const {
		channels,
		end,
		id,
		idType,
		idsConv,
		intents,
		start,
		agents,
		splits,
		events,
		regionals,
	} = useAppSelector(filterSelector)
	const { idOrg, idVa } = useCompanyAndIdVa()
	const { enqueueSnackbar } = useSnackbar()
	const { startLoading, stopLoading } = useLoading()
	const { downloadFile } = useDownloadFile()

	const getReference = async () => {
		// Verificar rango de fechas inferior o igual a un mes
		if (start && end) {
			const diff = moment(end).diff(moment(start), 'days')

			if (diff > 31) {
				enqueueSnackbar(
					`Selecciona un rango máximo de 31 días (selección actual: ${diff} días)`,
					{
						autoHideDuration: 15000,
						variant: 'warning',
						anchorOrigin: {
							horizontal: 'right',
							vertical: 'top',
						},
					}
				)
				return
			}
		}

		startLoading()
		try {
			const reference = await getHistoryReferenceFile({
				csvReport: true,
				end,
				start,
				idOrg,
				idVa,
				channels,
				id,
				idType,
				intents,
				idConv: idsConv,
				idRegionals: regionals,
			})
			downloadFile(reference, 'descarga_historial.zip')
			stopLoading()
		} catch (err) {
			detectUnauthorizedPromise(err, getReference).catch(() => {
				const { message, options } = getFileFailed
				enqueueSnackbar(message, options)
				stopLoading()
			})
		}
	}

	const getCsv = async () => {
		startLoading()
		try {
			const csv = await getNotAttendedCsvFile(idOrg, {
				csvReport: true,
				agents,
				channels,
				end,
				events,
				idRegionals: regionals,
				splits,
				start,
			})
			fileDownload(csv, `chats no atendidos_${start}_${end}.csv`)

			stopLoading()
		} catch (err) {
			detectUnauthorizedPromise(err, getCsv).catch(() => {
				const { message, options } = getFileFailed
				enqueueSnackbar(message, options)
				stopLoading()
			})
		}
	}

	const handleClick = () => {
		if (attention && attention === 'notAttended') {
			getCsv()
		} else {
			getReference()
		}
	}

	return (
		<Grid item container xs={12} justifyContent="space-between" py={1}>
			<Grid item>
				Mostrando{' '}
				<strong>
					{currentResults} de {totalResults}
				</strong>{' '}
				conversaciones
			</Grid>
			{attention !== 'attended' && (
				<Grid item>
					<Button variant="contained" onClick={handleClick}>
						Descargar reporte
					</Button>
				</Grid>
			)}
		</Grid>
	)
}
