import React, { useState } from 'react'
import {
	RowAction,
	RowSwitchAction,
	SubtableHeader,
	TableHeader,
} from '@/types/Table'
import {
	Menu,
	IconButton,
	TableCell,
	TableRow,
	Badge,
	Tooltip,
	Box,
	Switch,
	Link,
	Collapse,
	Table,
	TableHead,
	TableBody,
	SxProps,
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { GenericObject } from '@/types/GenericObject'
import { MenuItem } from './MenuItem'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import { ColumnSubtable } from './ColumnSubtable'
import ReactMarkdown from 'react-markdown'

interface Props<T> {
	headers: TableHeader[]
	data: T
	actions?: RowAction<T>[]
	buttonActions?: RowAction<T>[]
	switchAction?: RowSwitchAction<T>
	badgeColor?: string
	badgeText?: boolean
	linkText?: string
	// badgeTooltip?: string
	hoverEffect: boolean
	activeRow?: boolean
	actionAlign?:
		| 'left'
		| 'center'
		| 'right'
		| 'justify'
		| 'inherit'
		| undefined
	actionButtonCenter?: boolean
	subtableHeaders?: SubtableHeader[]
	subtableColumns?: string[]
	cellSubtable?: boolean
	subtableData?: T[]
	tooltip?: string
	disableWordbreak?: string[] | '*'
}

export const Row = <T extends GenericObject>({
	headers,
	data,
	actions,
	buttonActions,
	switchAction,
	badgeColor,
	badgeText,
	// badgeTooltip,
	linkText,
	activeRow = true,
	actionAlign = 'right',
	actionButtonCenter,
	hoverEffect,
	subtableHeaders,
	subtableData,
	cellSubtable,
	subtableColumns,
	tooltip,
	disableWordbreak,
}: Props<T>) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const [expandRow, setExpandRow] = useState(false)
	const [showActions, setShowActions] = useState(!hoverEffect)
	const open = Boolean(anchorEl)

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget)
	}
	const handleClose = () => {
		setAnchorEl(null)
	}
	const handleExpand = () => {
		setExpandRow(!expandRow)
	}

	const visibility = (lock?: boolean): SxProps => {
		return {
			visibility: showActions || lock ? 'visible' : 'hidden',
		}
	}

	return (
		<React.Fragment>
			<Tooltip title={tooltip}>
				<TableRow
					sx={{
						opacity: activeRow ? 1 : 0.5,
						':hover': {
							backgroundColor: '#e9e9e975',
						},
					}}
					onMouseEnter={() => setShowActions(true)}
					onMouseLeave={() =>
						hoverEffect ? setShowActions(false) : {}
					}
				>
					{headers.map(({ propertyName, type, align }, index) => {
						if (
							subtableColumns?.includes(propertyName) &&
							subtableData?.length &&
							cellSubtable
						) {
							// Mostrar subtabla teniendo en cuenta solo la primera columna para hacer el colspan
							if (subtableColumns[0] === propertyName) {
								return (
									<ColumnSubtable
										key={index}
										colSpan={subtableColumns.length}
										columns={subtableColumns}
										data={subtableData}
										expandRow={expandRow}
										handleExpand={handleExpand}
									/>
								)
							} else {
								return null
							}
						}

						const propertyValue = data[propertyName]?.toString()

						if (type !== 'actions') {
							return (
								<TableCell
									key={propertyName}
									sx={{
										py: 1,
										flex: 1,
										wordBreak:
											disableWordbreak === '*'
												? 'unset'
												: disableWordbreak?.includes(
														propertyName
												  )
												? 'unset'
												: 'break-word',
										textAlign: align ?? 'left',
									}}
								>
									{type === undefined ? (
										<ReactMarkdown>
											{propertyValue ?? ''}
										</ReactMarkdown>
									) : type === 'expand' &&
									  subtableData?.length ? (
										<Tooltip title={propertyValue}>
											<IconButton
												onClick={handleExpand}
												size="small"
											>
												{expandRow ? (
													<ExpandLess />
												) : (
													<ExpandMore />
												)}
											</IconButton>
										</Tooltip>
									) : type === 'switch' && switchAction ? (
										<Switch
											checked={activeRow}
											onChange={() => switchAction(data)}
										/>
									) : type === 'badge' && badgeColor ? (
										<Box sx={{ textAlign: 'center' }}>
											{/* <Tooltip title={badgeTooltip}> */}
											<Badge
												color={
													badgeColor as
														| 'primary'
														| 'secondary'
														| 'default'
														| 'error'
														| 'info'
														| 'success'
														| 'warning'
														| 'default'
												}
												variant="dot"
												sx={{ zIndex: 1 }}
											/>
											{/* </Tooltip> */}
											{badgeText && (
												<>
													&nbsp;&nbsp;&nbsp;
													{propertyValue}
												</>
											)}
										</Box>
									) : type === 'link' ? (
										propertyValue && (
											<Link
												href={propertyValue}
												target="_blank"
											>
												{linkText ?? propertyValue}
											</Link>
										)
									) : null}
								</TableCell>
							)
						} else {
							return (
								<TableCell
									key={propertyName}
									sx={{ py: 1 }}
									align={actionAlign}
								>
									<Box>
										{
											// Menu actions
											actions ? (
												<>
													<IconButton
														aria-label="Menú de acciones del registro"
														id="basic-button"
														aria-controls={
															open
																? 'basic-menu'
																: undefined
														}
														aria-haspopup="true"
														aria-expanded={
															open
																? 'true'
																: undefined
														}
														onClick={handleClick}
														sx={{ padding: 0 }}
													>
														<MoreVertIcon fontSize="small" />
													</IconButton>
													<Menu
														id="basic-menu"
														anchorEl={anchorEl}
														open={open}
														onClose={handleClose}
														MenuListProps={{
															'aria-labelledby':
																'basic-button',
														}}
														anchorOrigin={{
															vertical: 'bottom',
															horizontal: 'left',
														}}
														transformOrigin={{
															vertical: 'top',
															horizontal:
																'center',
														}}
													>
														{actions.map(
															(action) => (
																<MenuItem<T>
																	key={
																		action.id
																	}
																	{...action}
																	data={data}
																	onClose={
																		handleClose
																	}
																></MenuItem>
															)
														)}
													</Menu>
												</>
											) : // Button actions
											buttonActions ? (
												<Box
													display="flex"
													justifyContent={
														actionButtonCenter
															? 'center'
															: 'flex-end'
													}
												>
													{buttonActions.map(
														(action) => {
															return (
																<Tooltip
																	key={
																		action.id
																	}
																	title={
																		action.label
																	}
																>
																	<IconButton
																		{...((activeRow ||
																			Boolean(
																				action.canBeDisabled
																			) ===
																				false) && {
																			onClick:
																				() => {
																					action.action(
																						data
																					)
																				},
																		})}
																		sx={{
																			...visibility(
																				action.lock
																			),
																			cursor:
																				activeRow ||
																				!action.canBeDisabled
																					? 'pointer'
																					: 'not-allowed',
																		}}
																	>
																		{
																			action.icon
																		}
																	</IconButton>
																</Tooltip>
															)
														}
													)}
												</Box>
											) : null
										}
									</Box>
								</TableCell>
							)
						}
					})}
				</TableRow>
			</Tooltip>
			{!cellSubtable && expandRow && subtableHeaders && subtableData && (
				<TableRow>
					<TableCell colSpan={headers.length}>
						<Collapse in={expandRow}>
							<Table sx={{ padding: 0 }}>
								<TableHead>
									<TableRow>
										{subtableHeaders.map((header) => (
											<TableCell
												key={header.propertyName}
												align={header.align}
												sx={{
													fontWeight: 'bold',
												}}
											>
												{header.label}
											</TableCell>
										))}
									</TableRow>
								</TableHead>
								<TableBody>
									{subtableData.map((item) => {
										return (
											<TableRow key={item.id}>
												{subtableHeaders.map(
													({
														propertyName,
														align,
													}) => (
														<TableCell
															key={propertyName}
															sx={{
																py: 1,
																flex: 1,
																wordBreak:
																	'break-word',
															}}
															align={align}
															width={2}
														>
															{item[
																propertyName
															]?.toString()}
														</TableCell>
													)
												)}
											</TableRow>
										)
									})}
								</TableBody>
							</Table>
						</Collapse>
					</TableCell>
				</TableRow>
			)}
		</React.Fragment>
	)
}
