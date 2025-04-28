import type { FC } from "react";
import { useContext, useMemo, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
  NormalizedCacheObject
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

import config from '../../config/app.config';

import { AuthContext } from "../../auth/context/AuthContext";
import { ScreenMessageTypeEnum } from "../../common/enums/screen-message-type-enum";

interface Props {
  children: ReactNode;
}

// ApolloWrapper
export const ApolloWrapper: FC<Props> = ({ children }) => {
  
  const context = useContext(AuthContext);
  if (!context) 
    throw new Error("AuthContext must be used within an AuthProvider");
  
  const { authState, onLogout, setScreenMessage } = context;

  const navigate = useNavigate();

  const httpLink = createHttpLink({
    uri: `${config.SIPROAD_BFF_HOST}/graphql`,
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, extensions }) => {
        console.error(`Error [G]: ${message}`);

        if (extensions?.code === "UNAUTHENTICATED") {
          setScreenMessage({ type: ScreenMessageTypeEnum.SUCCESS, title: "Información", message: "Tu sesión ha expirado. Por favor inicia sesión de nuevo.", show: true });
          onLogout();
          navigate("/login");
        }
      });
    }

    if (networkError) {
      console.error(`Error [N]: ${networkError}`);
    }
  });

  const createApolloClient = (token: string): ApolloClient<NormalizedCacheObject> => {
    const authLink = setContext((_, { headers }) => ({
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    }));

    return new ApolloClient({
      link: authLink.concat(errorLink).concat(httpLink),
      cache: new InMemoryCache(),
    });
  };

  const apolloClient = useMemo(() => createApolloClient(authState.token), [authState.token]);

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
};
