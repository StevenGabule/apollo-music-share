/*import ApolloClient from 'apollo-boost'

const client = new ApolloClient({
    uri: 'https://todos-graphql-v2.herokuapp.com/v1/graphql'
});*/

import ApolloClient from "apollo-client";
import {WebSocketLink} from "apollo-link-ws";
import { InMemoryCache} from "apollo-cache-inmemory";

const client = new ApolloClient({
    link: new WebSocketLink({
        uri: 'wss://todos-graphql-v2.herokuapp.com/v1/graphql',
        options: {
            reconnect: true
        }
    }),
    cache: new InMemoryCache()
});

export default client;
