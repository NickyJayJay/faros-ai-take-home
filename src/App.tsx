import { ApolloProvider } from '@apollo/client/react'
import { apolloClient } from './graphql/client'

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <div className="min-h-screen bg-background">
        <p className="p-8 text-foreground">Faros Employee Dashboard — scaffold working</p>
      </div>
    </ApolloProvider>
  )
}

export default App
