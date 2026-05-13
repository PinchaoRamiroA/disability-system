import { Box, Typography, Card, CardContent, Grid } from '@mui/material'

export default function Dashboard() {
	const menuItems = [
		{ label: 'Incapacidades', path: 'incapacidades', color: '#1976d2' },
		{ label: 'Documentos', path: 'documentos', color: '#388e3c' },
		{ label: 'Transcripción', path: 'transcripcion', color: '#f57c00' },
		{ label: 'Seguimiento', path: 'seguimiento', color: '#7b1fa2' },
		{ label: 'Pagos', path: 'pagos', color: '#c2185b' },
		{ label: 'Conciliación', path: 'conciliacion', color: '#0097a7' },
		{ label: 'Alertas', path: 'alertas', color: '#d32f2f' },
		{ label: 'Reportes', path: 'reportes', color: '#512da8' },
		{ label: 'Usuarios', path: 'usuarios', color: '#455a64' },
		{ label: 'Configuración', path: 'configuracion', color: '#5d4037' },
	]

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant="h4" gutterBottom>
				Dashboard - Sistema de Gestión de Incapacidades
			</Typography>
			
			<Typography variant="body1" sx={{ mb: 3 }}>
				Seleccione una opción del menú lateral para comenzar.
			</Typography>

			<Grid container spacing={3}>
				{menuItems.map((item) => (
					<Grid item xs={12} sm={6} md={4} key={item.path}>
						<Card 
							sx={{ 
								cursor: 'pointer',
								transition: '0.2s',
								'&:hover': { transform: 'scale(1.02)' }
							}}
							onClick={() => alert(`Navegando a ${item.label} (pendiente implementación)`)}
						>
							<CardContent>
								<Typography variant="h6" style={{ color: item.color }}>
									{item.label}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									En desarrollo
								</Typography>
							</CardContent>
						</Card>
					</Grid>
				))}
			</Grid>
		</Box>
	)
}