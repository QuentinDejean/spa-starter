import Alert from '@mui/material/Alert'
import Typography from '@mui/material/Typography'
import { Component, ErrorInfo, ReactNode } from 'react'

type Props = {
  children: ReactNode
}

type State = {
  hasError: boolean
}

class GlobalErrorMessage extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('Uncaught error:', error, errorInfo)
    // logErrorToMyService(error, errorInfo)
  }

  render() {
    const { hasError } = this.state
    if (hasError) {
      // You can render any custom fallback UI
      return (
        <Alert elevation={6} severity="error" variant="filled" sx={{ width: '100%' }}>
          <Typography>
            Aha! It&rsquo;s not you, it&rsquo;s us - something unexpected happened. We&rsquo;re on it!
          </Typography>
        </Alert>
      )
    }

    const { children } = this.props

    return children
  }
}

export default GlobalErrorMessage
