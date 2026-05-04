import { Login as LoginComponent } from '@/components/Login'
import { LoginForm } from '@/components/Login/LoginForm'
import { Grid } from '@mui/material'

const Login = () => {
	return (
		<LoginComponent>
			<Grid
				item
				xs={12}
				display={'flex'}
				flexDirection={'column'}
				justifyContent={'center'}
			>
				<LoginForm />
			</Grid>
		</LoginComponent>
	)
}

export default Login
