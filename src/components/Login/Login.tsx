// import { Background, Content, CustomizedGrid, Form, Logo } from './styles'
import React from 'react'
import useNotifier from '@/hooks/useNotifier'
import { CssBaseline, Paper, Grid } from '@mui/material'
import { ChildrenType } from '@/types/Children'
import Image from 'next/image'

interface Props {
	children: ChildrenType
}

export const Login = ({ children }: Props) => {
	useNotifier()

	return (
		<Grid container component="main" sx={{ height: '100vh' }}>
			<CssBaseline />
			<Grid
				item
				xs={false}
				sm={4}
				md={7}
				sx={{
					backgroundImage: 'url(/images/Background.jpeg)',
					backgroundRepeat: 'no-repeat',
					backgroundColor: (t) =>
						t.palette.mode === 'light'
							? t.palette.grey[50]
							: t.palette.grey[900],
					backgroundSize: 'cover',
					backgroundPosition: 'center',
				}}
			/>
			<Grid
				item
				container
				px={4}
				xs={12}
				sm={8}
				md={5}
				component={Paper}
				elevation={6}
				square
				flexDirection={'column'}
				justifyContent={'center'}
			>
				<Grid item alignSelf="center" mb={2}>
					<Image
						src="/images/logo.jpg"
						alt="Logo de evalsoft"
						width={180}
						height={120}
					/>
				</Grid>

				<Grid container justifyContent={'center'}>
					{children}
				</Grid>
			</Grid>
		</Grid>
	)
}
