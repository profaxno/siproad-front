import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// * Configurar la URL del backend GraphQL
const httpLink = createHttpLink({
  uri: "http://localhost:3000/graphql", // Reemplaza con tu URL
});

// * Middleware para agregar el token hardcodeado
const authLink = setContext((_, { headers }) => {
  const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55SWQiOiJlNDA3MDA2My1iZDA5LTQ5OTMtOWFiMC1iZjBiN2Y1ZDY3ODUiLCJpZCI6IjNmMWY3ZTc3LTJhNDktNDUzNy1iZWI5LTYyMTFkNTE2ZTI5MyIsImlhdCI6MTc0MzEwNjcyMSwiZXhwIjoxNzQzMTM1NTIxfQ.vgtSA4vhdvZe1OSCXzeYPnWI-YLdXfXx_w9S6yEkwoc"; // TODO: Reemplaza con tu token
  return {
    headers: {
      ...headers,
      authorization: token,
    },
  };
});

// * Crear el cliente de Apollo
const client = new ApolloClient({
  link: authLink.concat(httpLink), // Combina el middleware con la conexión HTTP
  cache: new InMemoryCache(),
});

export default client;
