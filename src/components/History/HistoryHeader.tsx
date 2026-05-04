import React from 'react'
import { Grid, Typography } from '@mui/material'
import { isNumber } from '@/utils/helpers/castIndicatorResponse'
import { HistoryUserData } from '@/types/reports/humanAgent/History'

interface Props {
	userData: HistoryUserData | undefined
}

const formatNumberField = (text: string) => {
	return isNumber(text) ? (Number(text) > 0 ? text : '') : text
}

const Text = ({ label, value }: { label: string; value: string }) => {
	return (
		<Typography fontSize={12}>
			{label}: <strong>{value}</strong>
		</Typography>
	)
}

export const HistoryHeader = ({ userData }: Props) => {
	if (userData) {
		return (
			<Grid container p={1} justifyContent="center" gap={1}>
				<Grid item xs>
					<Text
						label="Tipo documento"
						value={userData.endCustIdType}
					/>
					<Text
						label="Número documento"
						value={formatNumberField(userData.endCustIdNumber)}
					/>
				</Grid>
				<Grid item xs>
					<Text label="Email" value={userData.endCustMail} />
					<Text
						label="Teléfono"
						value={formatNumberField(userData.endCustPhone)}
					/>
				</Grid>
				<Grid item xs>
					<Text
						label="Ubicación"
						value={
							userData.cityName && userData.departmentName
								? ` ${userData.cityName} - ${userData.departmentName}`
								: ''
						}
					/>
					<Text
						label="Id conversación"
						value={userData.conversationId}
					/>
				</Grid>
			</Grid>
		)
	}
	return <></>
}
