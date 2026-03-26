import { ApolloProvider } from '@apollo/client/react'
import { apolloClient } from './graphql/client'
import { FeatureFlagProvider } from './contexts/FeatureFlagContext'
import { ConsentProvider } from './contexts/ConsentContext'
import { ErrorBoundary } from './components/common/ErrorBoundary'
import { Header } from './components/layout/Header'
import { EmployeesPage } from './components/employees/EmployeesPage'
import { DevFlagToggle } from './components/common/DevFlagToggle'

function App() {
  return (
    <ErrorBoundary label="Application">
      <ApolloProvider client={apolloClient}>
        <FeatureFlagProvider>
          <ConsentProvider>
            <div className="flex min-h-screen flex-col bg-white">
              <Header />
              <EmployeesPage />
            </div>
            <DevFlagToggle />
          </ConsentProvider>
        </FeatureFlagProvider>
      </ApolloProvider>
    </ErrorBoundary>
  )
}

export default App
