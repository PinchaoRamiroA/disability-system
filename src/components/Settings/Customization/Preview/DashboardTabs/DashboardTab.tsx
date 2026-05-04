import React from 'react'
import { CONTAINER_HEIGHT_CALC } from '@/utils/constants/containerHeight'
import {
	Button,
	Checkbox,
	FormControlLabel,
	FormGroup,
	Grid,
	Switch,
	TextField,
	Typography,
} from '@mui/material'
import { MiniAppbar } from './MiniAppbar'
import { Table } from '@/components/Table'
import { TableHeader } from '@/types/Table'

interface DummyData {
	[key: string]: number | string | boolean
	id: number
	activo: boolean
	nombre: string
	descripcion: string
}

const dataTableDummy: DummyData[] = [
	{
		activo: true,
		descripcion:
			'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laboriosam, corrupti adipisci dolorem nobis impedit quasi voluptates. Consequatur, delectus.',
		id: 1,
		nombre: 'Lorem ipsum dolor sit amet',
	},
	{
		activo: false,
		descripcion:
			'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laboriosam, corrupti adipisci dolorem nobis impedit quasi voluptates. Consequatur, delectus.',
		id: 2,
		nombre: 'Lorem ipsum dolor sit amet',
	},
]

const tableHeaders: TableHeader[] = [
	{
		label: 'Activo',
		propertyName: 'activo',
		type: 'switch',
	},
	{
		label: 'Id',
		propertyName: 'id',
	},
	{
		label: 'Nombre',
		propertyName: 'nombre',
	},
	{
		label: 'Descripcion',
		propertyName: 'descripcion',
	},
]

export const DashboardTab = () => {
	return (
		<Grid
			container
			height={`calc(${CONTAINER_HEIGHT_CALC} - 3em)`}
			overflow={'auto'}
		>
			{/* Appbar */}
			<MiniAppbar />

			{/* Body */}
			<Grid container item xs={12} p={2} gap={2} bgcolor={'#f5f5f5'}>
				<Grid item container xs={12} alignItems="center">
					<Grid item xs={12}>
						<Typography>
							Ejemplo de configuración de colores
						</Typography>
					</Grid>

					<Grid
						item
						xs={12}
						gap={2}
						justifyContent="flex-start"
						my={2}
						display="flex"
					>
						<Button variant="contained">Principal</Button>
						<Button variant="outlined">Principal</Button>
						<Button variant="contained" color="secondary">
							{' '}
							Secundario{' '}
						</Button>
						<Button variant="outlined" color="secondary">
							{' '}
							Secundario{' '}
						</Button>
					</Grid>
					<Grid
						item
						xs={12}
						gap={2}
						justifyContent="flex-start"
						display="flex"
					>
						<TextField
							id="outlined-basic"
							label="Ejemplo"
							variant="outlined"
							size="small"
						/>
						<FormGroup>
							<FormControlLabel
								control={
									<Switch defaultChecked color="secondary" />
								}
								label="Switch"
							/>
						</FormGroup>

						<FormGroup>
							<FormControlLabel
								control={<Checkbox color="secondary" />}
								label="Checkbox"
							/>
						</FormGroup>
					</Grid>
				</Grid>

				{/* Tabla Dummy */}
				<Grid item xs={12}>
					<Table
						data={dataTableDummy}
						headers={tableHeaders}
						activeColumn="activo"
						status="resolved"
						switchAction={() => {
							return
						}}
						pagination={false}
					/>
				</Grid>
			</Grid>
		</Grid>
	)
}
