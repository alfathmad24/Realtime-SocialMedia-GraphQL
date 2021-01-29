const express = require("express");
const http = require("http");
const { ApolloServer, PubSub } = require("apollo-server-express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers/index");
const connectDB = require("./config/db");

const pubsub = new PubSub();

dotenv.config();

connectDB();

const app = express();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req, pubsub }),
    cors: {
        credentials: true,
        origin: true,
    },
});

server.applyMiddleware({ app });

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
    // Set static folder
    app.use(express.static("client/build"));

    app.get("*", (request, response) => {
        response.sendFile(
            path.resolve(__dirname, "client", "build", "index.html")
        );
    });
}

const PORT = process.env.PORT || 5000;

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

// ⚠️ Pay attention to the fact that we are calling `listen` on the http server variable, and not on `app`.
httpServer.listen(PORT, () => {
    console.log(
        `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
    );
    console.log(
        `🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`
    );
});
