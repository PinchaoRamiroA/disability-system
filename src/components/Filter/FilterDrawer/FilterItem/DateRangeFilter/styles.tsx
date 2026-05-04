import { styled } from '@mui/system'
import DatePicker from 'react-datepicker'
import { Theme } from '@mui/material/styles'

export const Picker = styled(DatePicker)<{ theme?: Theme }>(
  ({ theme }) => `
  border-radius: ${theme.shape.borderRadius}px;
  padding: ${theme.spacing(2)};
  min-width: 290px;
  padding: ${theme.spacing(2)};
  text-align: center;
  display: block;
  margin: 0 auto;
`
)
