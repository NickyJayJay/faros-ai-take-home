import { ApolloProvider } from '@apollo/client/react'
import { apolloClient } from './graphql/client'
import { Header } from './components/layout/Header'
import { EmployeesPage } from './components/employees/EmployeesPage'

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <div className="flex min-h-screen flex-col bg-white">
        <Header />
        <EmployeesPage />
      </div>
    </ApolloProvider>
  )
}

export default App
