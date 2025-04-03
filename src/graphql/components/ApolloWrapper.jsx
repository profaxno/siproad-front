import React, { useContext, useMemo } from "react";
import {  } from "@apollo/client";

import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from '@apollo/client/link/error';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from "../../auth/context/AuthContext";
import { Message } from "../../common/components/Message";

import config from "../../config/app.config";

const httpLink = createHttpLink({
  uri: `${config.SIPROAD_BFF_HOST}/graphql` //"http://localhost:3000/graphql",
});

export const ApolloWrapper = ({ children }) => {
  
  // hooks
  const { authState, onLogout } = useContext(AuthContext);
  const navigate = useNavigate(); 

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, extensions }) => {
        if (extensions?.code === 'UNAUTHENTICATED') {
          alert('Tu sesión ha expirado. Por favor inicia sesión de nuevo.'); // TODO: falta crear un componente de mensaje
          onLogout();
          navigate('/login');
        }
      });
    }

    if (networkError) {
      console.error(`[Network error]: ${networkError}`);
    }
  });

  // handlers
  // const { token } = authState;

  const createApolloClient = (token) => {
    const authLink = setContext((_, { headers }) => ({
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      }
    }))
  
    return new ApolloClient({
      link: authLink.concat(errorLink).concat(httpLink),
      cache: new InMemoryCache(),
    })
  }

  const apolloClient = useMemo(() => createApolloClient(authState.token), [authState.token]);

  // return component
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}

// const Root = () => (
//   <AuthProvider>
//     <ApolloWrapper>
//       <App />
//     </ApolloWrapper>
//   </AuthProvider>
// );

// export default Root;
