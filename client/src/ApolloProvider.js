import React from "react";
import App from "./App";
import {
    ApolloClient,
    InMemoryCache,
    createHttpLink,
    ApolloProvider,
    split,
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";
import { setContext } from "apollo-link-context";

const wsLink = new WebSocketLink({
    uri: `ws://realtime-socialmedia.herokuapp.com/graphql`,
    options: {
        reconnect: true,
    },
});

const httpLink = createHttpLink({
    uri: "https://realtime-socialmedia.herokuapp.com/graphql",
});

const authLink = setContext(() => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: token ? `Bearer ${token}` : "",
        },
    };
});

const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
        );
    },
    wsLink,
    httpLink
);

const client = new ApolloClient({
    link: authLink.concat(splitLink),
    cache: new InMemoryCache(),
});

export default (
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
);
