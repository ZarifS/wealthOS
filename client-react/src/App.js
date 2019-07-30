import React from 'react'
import styled from 'styled-components/macro'
import colors from './styles/colors'
import LoginForm from './components/loginForm'

function App() {
  return (
    <StyledApp>
      <Title>
        <p>Wealth X </p>
      </Title>
      <LoginForm />
    </StyledApp>
  )
}
const StyledApp = styled.div`
  background: ${colors.background};
  color: ${colors.primary};
  min-height: 100vh;
  position: absolute;
  width: 100%;
`

const Title = styled.div`
  margin-left: 75px;
  padding-top: 20px;
  margin-bottom: 34px;
`

export default App
