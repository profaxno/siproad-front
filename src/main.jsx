import { createRoot } from 'react-dom/client'

import { BrowserRouter } from 'react-router'

import './index.css'
// import { ApolloProvider } from "@apollo/client";
// import client from "./apolloClient";

import { SiproadRouter } from './siproad/routes/SiproadRouter';

createRoot(document.getElementById('root')).render(
  
  // <ApolloProvider client={client}>
  //   <SalesOrder/>
  // </ApolloProvider>

  <BrowserRouter>
    <SiproadRouter/>
  </BrowserRouter>
)