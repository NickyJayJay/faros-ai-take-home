import { ApolloProvider } from '@apollo/client/react'
import { apolloClient } from './graphql/client'
import { ConsentProvider } from './contexts/ConsentContext'
import { Header } from './components/layout/Header'
import { EmployeesPage } from './components/employees/EmployeesPage'

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <ConsentProvider>
        <div className="flex min-h-screen flex-col bg-white">
          <Header />
          <EmployeesPage />
        </div>
      </ConsentProvider>
    </ApolloProvider>
  )
}

export default App
