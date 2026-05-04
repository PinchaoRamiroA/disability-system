import React, { useState } from 'react'
import {
	Grid,
	Typography,
	Collapse,
	IconButton,
	IconButtonProps,
	Tooltip,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import { AttentionReview } from './ReviewItem/AttentionReview'
import { ChannelsReview } from './ReviewItem/ChannelsReview'
import { DateRangeReview } from './ReviewItem/DateRangeReview'
import { EntriesReview } from './ReviewItem/EntriesReview'
import { IntentsReview } from './ReviewItem/IntentsReview'
import { LocationsReview } from './ReviewItem/LocationsReview'
import { ResolutionReview } from './ReviewItem/ResolutionsReview'
import { UserIdReview } from './ReviewItem/UserIdReview'
import { CompanyReview } from './ReviewItem/CompanyReview'
import { VirtualAgentReview } from './ReviewItem/VirtualAgentReview'
import { ApplyFilters } from '@/types/Filter/Filter'
import { SplitsReview } from './ReviewItem/SplitsReview'
import { EventsReview } from './ReviewItem/EventsReview'
import { AgentsReview } from './ReviewItem/AgentsReview/AgentsReview'
import { NotificationTypesReview } from './ReviewItem/NotificationTypesReview/NotificationTypesReview'

import {
	ADMIN_ROLE,
	SUPERADMIN_ROLE,
	SUPERVIEWER_ROLE,
	VIEWER_ROLE,
} from '@/utils/constants/roles'
import { CausalesReview } from './ReviewItem/CausalesReview'
import { IntegrationServiceReview } from './ReviewItem/IntegrationServiceReview'
import { IdsConvReview } from './ReviewItem/IdsConvReview'

interface Props {
	filters: ApplyFilters
	showFilters: boolean
	role: number
}

interface ExpandMoreProps extends IconButtonProps {
	expand: boolean
}

const ExpandMore = styled((props: ExpandMoreProps) => {
	const { expand, ...other } = props
	if (expand) return <IconButton {...other} />
	return <IconButton {...other} />
})(({ theme, expand }) => ({
	transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
	marginLeft: 'auto',
	transition: theme.transitions.create('transform', {
		duration: theme.transitions.duration.shortest,
	}),
}))

export const FilterResume = ({ filters, showFilters, role }: Props) => {
	const {
		dates,
		channels,
		resolution,
		attention,
		user,
		entries,
		locations,
		intents,
		splits,
		singleSplit,
		regionals,
		events,
		agents,
		notificationChannels,
		causalesFin,
		causalesNegocio,
		integrationService,
		// causalesPasoAutomatico,
		// integrationStatus,
		// locationsCities,
		// virtualAgent,
		// companies,
		// idConv,
		idsConv,
		// range,
	} = filters

	const [expanded, setExpanded] = useState(false)

	const handleExpandClick = () => {
		setExpanded(!expanded)
	}

	return (
		<Grid container alignItems="center" justifyContent="space-between">
			{/* Filtros principales */}
			<Grid item xs={12} sm>
				<Grid container spacing={1}>
					{dates && (
						<Grid item>
							<DateRangeReview />
						</Grid>
					)}
					{channels && (
						<Grid item>
							<ChannelsReview />
						</Grid>
					)}

					{attention && (
						<Grid item>
							<AttentionReview />
						</Grid>
					)}
				</Grid>
			</Grid>

			{/* Botón collapse */}
			{showFilters && (
				<Grid
					item
					xs={12}
					sm="auto"
					textAlign="center"
					alignSelf="flex-start"
				>
					<ExpandMore
						expand={expanded}
						onClick={handleExpandClick}
						aria-expanded={expanded}
						aria-label="Otros filtros aplicados"
					>
						<Tooltip title="Filtros aplicados">
							<ExpandMoreIcon />
						</Tooltip>
					</ExpandMore>
				</Grid>
			)}

			{/* Collapse con filtros secundarios */}
			{showFilters && (
				<Grid item xs={12} paddingLeft={1}>
					<Collapse in={expanded} timeout="auto" unmountOnExit>
						<Grid
							container
							spacing={1}
							marginY={0.5}
							paddingBottom={1}
							bgcolor="#fafafa"
							border={1}
							borderRadius={2}
							borderColor="#c9c9c9"
						>
							<Grid item xs={12} marginBottom={1}>
								<Typography
									variant="caption"
									component="span"
									fontWeight="bold"
								>
									Filtros aplicados:
								</Typography>
							</Grid>

							{/* Tipos de notificación */}
							{notificationChannels && (
								<Grid item>
									<NotificationTypesReview />
								</Grid>
							)}

							{resolution && (
								<Grid item>
									<ResolutionReview />
								</Grid>
							)}
							{attention && (
								<Grid item>
									<AttentionReview />
								</Grid>
							)}
							{user && (
								<Grid item>
									<UserIdReview />
								</Grid>
							)}
							{entries && (
								<Grid item>
									<EntriesReview />
								</Grid>
							)}
							{(locations || regionals) && (
								<Grid item>
									<LocationsReview />
								</Grid>
							)}
							{intents && (
								<Grid item>
									<IntentsReview />
								</Grid>
							)}
							{/* Splits */}
							{(splits || singleSplit) && (
								<Grid item>
									<SplitsReview />
								</Grid>
							)}
							{/* Eventos */}
							{events && (
								<Grid item>
									<EventsReview />
								</Grid>
							)}
							{/* Asesores */}
							{agents && (
								<Grid item>
									<AgentsReview />
								</Grid>
							)}

							{/* Causales negocio */}
							{causalesNegocio && (
								<Grid item>
									<CausalesReview />
								</Grid>
							)}

							{/* Nombre de servicio integración */}
							{integrationService && (
								<Grid item>
									<IntegrationServiceReview />
								</Grid>
							)}

							{/* Causales finalización */}
							{causalesFin && (
								<Grid item>
									<CausalesReview negocio={false} />
								</Grid>
							)}
							{(role === ADMIN_ROLE || role === VIEWER_ROLE) && (
								<Grid item>
									<VirtualAgentReview />
								</Grid>
							)}
							{(role === SUPERADMIN_ROLE ||
								role === SUPERVIEWER_ROLE) && (
								<Grid item>
									<CompanyReview />
								</Grid>
							)}

							{idsConv && (
								<Grid item>
									<IdsConvReview />
								</Grid>
							)}
						</Grid>
					</Collapse>
				</Grid>
			)}
		</Grid>
	)
}
