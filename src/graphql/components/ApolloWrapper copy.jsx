import React, { useContext, useMemo } from "react";
import {  } from "@apollo/client";

import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import { AuthContext } from "../../auth/context/AuthContext";

const httpLink = createHttpLink({
  uri: "http://localhost:3000/graphql",
});

export const ApolloWrapper = ({ children }) => {
  
  // handlers
  const createApolloClient = (token) => {
    const authLink = setContext((_, { headers }) => ({
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      }
    }))
  
    return new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
    })
  }

  // hooks
  const { authState } = useContext(AuthContext);
  const { token } = authState;
  const apolloClient = useMemo(() => createApolloClient(token), [token]);

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
