// import { ApolloClient, ApolloLink, InMemoryCache, createHttpLink } from "@apollo/client";

// const httpLink = new createHttpLink({
//     uri: "https://y20q5vo65h.execute-api.us-east-1.amazonaws.com/dev/",
// });

// const defaultOptions = {
//     watchQuery: {
//         fetchPolicy: 'no-cache',
//         nextFetchPolicy: 'no-cache'
//     },
//     query: {
//         fetchPolicy: 'no-cache',
//         nextFetchPolicy: 'no-cache'
//     },
// }

// export const client = new ApolloClient({
//     cache: new InMemoryCache({ resultCaching: false }),
//     link: ApolloLink.from([httpLink]),
//     defaultOptions: defaultOptions
// });
