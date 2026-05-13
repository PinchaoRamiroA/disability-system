import { styled } from '@mui/material/styles'

export const Background = styled('div')`
  grid-row: 1/3;
  grid-column: 1/2;
  background-image: url('/images/Background.jpeg');
  background-size: 100% 100%;
`
export const Content = styled('div')`
  grid-row: 1/3;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  grid-column: auto;
  background-color: #fafafa;
  flex-direction: column;
`
export const Form = styled('form')`
  width: 40%;
  height: 50%;
  display: flex;
  text-align: center;
  padding: 10px;
  margin-left: auto;
  margin-right: auto;
  padding-top: 20px;
  flex-direction: column;
`
export const Logo = styled('div')`
  width: 100%;
  height: 50%;
  padding: 10px;
  padding-top: 50px;
`

export const CustomizedGrid = styled('main')`
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
`
