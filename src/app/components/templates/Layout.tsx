import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { Global, css } from '@emotion/react'
import Box from '@mui/material/Box'

import theme from '@app/utils/Theme'

import GlobalErrorMessage from './GlobalErrorMessage'

type Props = {
  children: React.ReactNode
}

const Layout = ({ children }: Props) => (
  <MuiThemeProvider theme={theme}>
    <Global
      styles={css`
        :root {
          font-size: ${theme.typography.fontSize}px;
        }

        body {
          background-color: #fafafa;
          height: 100vh;
          margin: 0;
        }
      `}
    />

    <Box sx={{ backgroundColor: '#fafafa' }}>
      <Box sx={{ m: 5 }}>
        <GlobalErrorMessage>{children}</GlobalErrorMessage>
      </Box>
    </Box>
  </MuiThemeProvider>
)

export default Layout
