import React, { useCallback, useState } from 'react'
import { Derivacion } from '@/types/Splits'
import { useDrag, useDrop } from 'react-dnd'
import {
	Box,
	Grid,
	IconButton,
	Paper,
	Stack,
	TextField,
	Typography,
} from '@mui/material'
import { useAppDispatch } from '@/hooks/useReduxHooks'
import { deleteSplitDerive, updateSplitDerive } from '@/store/slices/splits'
import { Clear, DragHandle } from '@mui/icons-material'
import { useSplitContext } from '@/hooks/useSplitContext'

interface DerivacionItem {
	derivacion: Derivacion
	index: number
}

interface DraggableItemProps extends DerivacionItem {
	onMove: (dragIndex: number, hoverIndex: number) => void
	handleDelete: (item: Derivacion) => void
}

const DraggableItem = ({
	derivacion,
	index,
	onMove,
	handleDelete,
}: DraggableItemProps) => {
	const [hover, setHover] = useState(false)
	const [showInput, setShowInput] = useState(false)
	const [priorityValue, setPriorityValue] = useState<number>(
		derivacion.priority
	)

	const dispatch = useAppDispatch()
	const { currentSplit, setCurrentSplit } = useSplitContext()

	const [{ isDragging }, drag] = useDrag({
		type: 'ITEM', // Puedes cambiar 'ITEM' por el tipo de elemento que estás arrastrando
		item: { index, derivacion },
		collect: (monitor) => ({
			isDragging: !!monitor.isDragging(),
		}),
	})

	const [{ isOver }, drop] = useDrop({
		accept: 'ITEM', // Asegúrate de que coincida con el tipo de elemento arrastrado
		//   hover: (item: { index: number }) => {
		//     const dragIndex = item.index;
		//     const hoverIndex = index;

		//     if (dragIndex === hoverIndex) {
		//       return;
		//     }

		//     onMove(dragIndex, hoverIndex);
		//     item.index = hoverIndex;

		//     console.log("Hover")
		//   },
		drop: (item: { index: number }) => {
			const dragIndex = item.index
			const hoverIndex = index

			if (dragIndex === hoverIndex) {
				return
			}

			onMove(dragIndex, hoverIndex)
			item.index = hoverIndex
		},
		collect: (monitor) => ({
			isOver: !!monitor.isOver(),
		}),
	})

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			const newPriority = Number((e.target as HTMLInputElement).value)
			setPriorityValue(newPriority)
			setShowInput(false)

			// Derivaciones actuales
			const copiaDerivaciones = currentSplit.derivaciones

			// Reorganizar prioridades en la copia
			// Crear un array con elementos con un número de prioridad menor a la seteada
			const copia1 = copiaDerivaciones.filter((item) => {
				// Ignorar prioridad que se modificó
				if (item.id_splits_derive === derivacion.id_splits_derive) {
					return false
				} else if (
					newPriority < derivacion.priority
						? item.priority < newPriority
						: item.priority <= newPriority
				) {
					return true
				}
				return false
			})
			// Agregar derivación actualizada a este array
			copia1.push(derivacion)

			// Generar segundo array con números de prioridades mayores a la seteada
			const copia2 = copiaDerivaciones.filter((item) => {
				if (item.id_splits_derive === derivacion.id_splits_derive) {
					return false
				} else if (
					newPriority > derivacion.priority
						? item.priority > newPriority
						: item.priority >= newPriority
				) {
					return true
				}
				return false
			})

			// Combinar copias y redefinir prioridades
			let toUpdate = copia1.concat(copia2)
			toUpdate = toUpdate.map((item, index) => {
				return {
					...item,
					priority: index + 1,
				}
			})

			setCurrentSplit({ ...currentSplit, derivaciones: toUpdate })

			// Actualizar prioridades
			dispatch(
				updateSplitDerive({
					idSplit: currentSplit.idSplit,
					derivaciones: toUpdate,
				})
			)

			handleHideInput()
		}
	}

	const handleHideInput = () => {
		setPriorityValue(derivacion.priority)
		setShowInput(false)
	}

	return (
		<Box
			ref={(node: HTMLElement | null) => drag(drop(node))}
			sx={{
				py: 0.5,
				px: 2,
				cursor: isDragging ? 'grabbing' : 'pointer',
				border: isOver ? '1px solid #000' : '1px solid #CCC',
				borderRadius: 2,
				mb: 0.5,
			}}
			justifyContent="space-between"
			display="flex"
			component={Paper}
			elevation={0}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
		>
			<Box display="flex" justifyContent="flex-start">
				<DragHandle />
				<Box ml={2}>
					<Typography>{derivacion.nameSplitDerive}</Typography>
					<Box display="flex" alignItems="center">
						<Typography variant="caption">
							Prioridad: &nbsp;
						</Typography>
						{showInput && (
							<TextField
								value={priorityValue}
								type="number"
								inputProps={{
									min: 1,
									max: currentSplit.derivaciones.length,
								}}
								onKeyDown={handleKeyDown}
								onBlur={handleHideInput}
								onChange={(e) =>
									setPriorityValue(Number(e.target.value))
								}
								sx={{
									'& input': {
										fontSize: '0.8rem',
									},
								}}
								size="small"
							/>
						)}
						{!showInput && (
							<Typography
								variant="caption"
								component={Box}
								onClick={() => setShowInput(true)}
								sx={{
									':hover': {
										backgroundColor: '#ccc',
									},
									backgroundColor: '#eee',
									borderRadius: '50%',
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									height: 20,
									width: 20,
									padding: 0,
									margin: 0,
								}}
							>
								<strong>{derivacion.priority}</strong>
							</Typography>
						)}
					</Box>
				</Box>
			</Box>
			<IconButton
				sx={{ visibility: hover ? 'visible' : 'hidden' }}
				onClick={() => handleDelete(derivacion)}
			>
				<Clear />
			</IconButton>
		</Box>
	)
}

export const DraggableZone = () => {
	const dispatch = useAppDispatch()
	const { currentSplit, setCurrentSplit } = useSplitContext()
	const { derivaciones } = currentSplit

	const onMove = useCallback(
		(dragIndex: number, hoverIndex: number) => {
			// Lógica para reorganizar el orden de derivaciones en el estado
			// Puedes usar el estado local o un estado global como Redux
			const draggedDerivacion = derivaciones[dragIndex]

			// Crear una nueva lista reordenada
			let updatedDerivaciones = [...derivaciones]
			updatedDerivaciones.splice(dragIndex, 1)
			updatedDerivaciones.splice(hoverIndex, 0, draggedDerivacion)

			updatedDerivaciones = updatedDerivaciones.map((item, index) => {
				return {
					...item,
					priority: index + 1,
				}
			})

			setCurrentSplit({
				...currentSplit,
				derivaciones: updatedDerivaciones,
			})
			dispatch(
				updateSplitDerive({
					derivaciones: updatedDerivaciones,
					idSplit: currentSplit.idSplit,
				})
			)

			// Actualizar el estado o enviar la nueva lista a través de la lógica de manejo en el componente padre
			// Puedes usar el estado local o un estado global como Redux
			setCurrentSplit({
				...currentSplit,
				derivaciones: updatedDerivaciones,
			}) // Descomentar si estás usando un estado local

			// Llamada a la lógica de manejo en el componente padre si es necesario
			handleMove(dragIndex, hoverIndex)
		},
		[currentSplit.derivaciones]
	)

	const handleMove = (dragIndex: number, hoverIndex: number) => {
		// Lógica adicional si es necesario
		console.log('Moved item from', dragIndex, 'to', hoverIndex)
	}

	const handleDelete = (item: Derivacion) => {
		dispatch(
			deleteSplitDerive({
				codigoRegistro: item.id_splits_derive,
				idSplit: item.split_origin,
			})
		).then((res) => {
			if (res.meta.requestStatus === 'fulfilled') {
				const derivaciones = currentSplit.derivaciones.filter(
					(derivacion) =>
						derivacion.id_splits_derive !== item.id_splits_derive
				)
				setCurrentSplit({ ...currentSplit, derivaciones })
				handleAfterDelete(derivaciones)
			}
		})
	}

	// Re organizar prioridades después de eliminar una derivación
	const handleAfterDelete = (derivacionesSplit: Derivacion[]) => {
		const derivaciones = derivacionesSplit.map((item, index) => {
			return {
				...item,
				priority: index + 1,
			}
		})

		setCurrentSplit({ ...currentSplit, derivaciones })
		dispatch(
			updateSplitDerive({
				derivaciones,
				idSplit: currentSplit.idSplit,
			})
		)
	}

	return (
		<Grid item xs={12}>
			{/* Zona de organización */}
			<Box>
				<Stack>
					{currentSplit.derivaciones.map((derivacion, index) => (
						<DraggableItem
							key={index}
							index={index}
							derivacion={derivacion}
							onMove={onMove}
							handleDelete={handleDelete}
						/>
					))}
				</Stack>
			</Box>
		</Grid>
	)
}
