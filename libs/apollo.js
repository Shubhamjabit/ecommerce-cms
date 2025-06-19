import {useMemo} from 'react';
import {
  ApolloClient,
  HttpLink,
  ApolloLink,
  InMemoryCache,
  from,
} from '@apollo/client';
import {gql} from 'apollo-boost';
import {onError} from '@apollo/client/link/error';
// import { FrogotPasswordStepQuery } from '../graphql/Queries/FrogotPasswordQueries';
// import { AccountSettingsQuery } from '../graphql/Queries/AccountSettingsQueries';
// import { ShippingAddressQuery } from '../graphql/Queries/ShippingAddressQueries';
// import { DashboardNavigationQuery } from '../graphql/Queries/DashboardNavigationQueries';
// import { ChangeNumberNavigationQuery } from '../graphql/Queries/ChangeNumbersQueries';
import Amplify, {Auth} from 'aws-amplify';
let apolloClient;

function createApolloClient() {
  const httpLink = new HttpLink({uri: process.env.BACKEND_URL});

  const logoutLink = onError(({networkError}) => {
    if (networkError.statusCode === 401) {
      // logout();
    }
  });

  const authMiddleware = new ApolloLink(async (operation, forward) => {
    let authorization = '';
    let identity = '';
    let currentSession;

    try {
      currentSession = await Auth.currentSession();
    } catch (error) {
      console.log(error);
    }

    if (currentSession) {
      authorization = currentSession.accessToken.jwtToken;
      identity = currentSession.idToken.jwtToken;
    }

    if (typeof window !== 'undefined') {
      operation.setContext(({headers = {}}) => ({
        headers: {
          ...headers,
          'x-api-key': process.env.BACKEND_KEY,
          authorization: authorization,
          identity: identity,
        },
      }));
    }

    return forward(operation);
  });

  const cache = new InMemoryCache({
    dataIdFromObject: (o) => o.id,
    // {
    //   // o.id ? `${o.__typename}-${o.id}` : `${o.__typename}-${o.cursor}`;
    //   // o.name ? `${o.__typename}-${o.name}` : `${o.__typename}-${o.cursor}`;

    // },
  });

  const client = new ApolloClient({
    link: from([authMiddleware, httpLink]),
    cache,
    typeDefs: gql`
      enum ProductOrderBy {
        HIGHPRICE
        LOWPRICE
        STATUS_ASC
        STATUS_DESC
        LEGACY_ID_ASC
        LEGACY_ID_DESC
        NAME_ASC
        NAME_DESC
      }
    `,
  });

  // cache.writeQuery({
  //   query: FrogotPasswordStepQuery,
  //   data: {
  //     forgotPasswordstep: 1,
  //   },
  // });

  // cache.writeQuery({
  //   query: AccountSettingsQuery,
  //   data: {
  //     accountSettingsStep: 1,
  //   },
  // });
  // cache.writeQuery({
  //   query: ShippingAddressQuery,
  //   data: {
  //     shippingAddressStep: 1,
  //   },
  // });
  // cache.writeQuery({
  //   query: DashboardNavigationQuery,
  //   data: {
  //     dashboardNavigationStep: 1,
  //   },
  // });
  // cache.writeQuery({
  //   query: ChangeNumberNavigationQuery,
  //   data: {
  //     numberChangingStep: 1,
  //   },
  // });

  return client;
}

export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient();
  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();
    // Restore the cache using the data passed from getStaticProps/getServerSideProps
    // combined with the existing cached data
    _apolloClient.cache.restore({...existingCache, ...initialState});
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(initialState) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}
