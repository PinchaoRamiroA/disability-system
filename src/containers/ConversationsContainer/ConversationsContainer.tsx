import React, { useState } from 'react'
import {
	AttentionInteractions,
	HistoryUserData,
	InteractionBase,
} from '@/types/reports/humanAgent/History'

import { Box, Grid, Paper } from '@mui/material'
import {
	PaginationButtons,
	PaginationInfo,
} from '@/components/History/Pagination'
import { InteractionsList } from '@/components/History/InteractionsList'
import { HistoryViewer } from '@/components/History/HistoryViewer'

import { useResizeDetector } from 'react-resize-detector'
import { AttentionValue } from '@/types/Filter/Filter'

interface Props {
	currentPage: number
	currentResults: number
	interactions: InteractionBase[]
	attentionInteractions: AttentionInteractions[]
	handlePageChange: (newPage: number) => void
	totalPages: number
	totalResult: number
	attention?: AttentionValue
}

export const ConversationsContainer = ({
	currentPage,
	currentResults,
	interactions = [],
	attentionInteractions,
	handlePageChange,
	totalPages,
	totalResult,
	attention,
}: Props) => {
	const { ref, height: paginationHeight } = useResizeDetector()

	const containerHeight = '100vh - 56px - 3em'
	const paginationInfoHeight = '52.5px'
	const interactionsHeight = `${containerHeight} - ${paginationInfoHeight} - 3px`
	const interactionsLength = attention
		? attentionInteractions.length
		: interactions.length

	const [userData, setUserData] = useState<HistoryUserData>()

	return (
		<Grid item xs={12}>
			{interactionsLength > 0 && (
				<Grid
					item
					xs={12}
					container
					height={`calc(${containerHeight})`}
					overflow="hidden"
				>
					{/* Info paginación y botón de descarga */}
					<PaginationInfo
						currentResults={currentResults}
						totalResults={totalResult}
						attention={attention}
					/>

					{/* Interacciones, paginación e historial de conversación seleccionada */}
					<Grid
						item
						container
						bgcolor="white"
						sx={{ border: 1, borderColor: '#e5e5e5' }}
						flex={1}
						component={Paper}
						elevation={2}
					>
						<Grid item container xs={4}>
							{/* Interacciones */}
							<InteractionsList
								interactions={interactions}
								attentionInteractions={attentionInteractions}
								height={`${interactionsHeight} - ${paginationHeight}px`}
								setUserData={setUserData}
							/>
							{/* Paginación */}
							<Grid item xs={12} component={Box} ref={ref}>
								<PaginationButtons
									totalPages={totalPages}
									changePage={handlePageChange}
									currentPage={currentPage}
								/>
							</Grid>
						</Grid>

						{/* Conversación seleccionada */}
						<HistoryViewer
							height={interactionsHeight}
							userData={userData}
						/>
					</Grid>
				</Grid>
			)}

			{interactionsLength === 0 && (
				<Grid
					container
					justifyContent="center"
					alignItems="center"
					height="100px"
					bgcolor="white"
					border={1}
					borderColor="#e5e5e5"
				>
					No hay interacciones para mostrar o no se encontraron.
				</Grid>
			)}
		</Grid>
	)
}
