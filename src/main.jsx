// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import { ApolloProvider } from "@apollo/client";
import client from "./apolloClient";

import { SalesOrder } from './sales/components/SalesOrder'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    // <SalesOrder/>
  // </StrictMode>

  <ApolloProvider client={client}>
    <SalesOrder/>
  </ApolloProvider>
)