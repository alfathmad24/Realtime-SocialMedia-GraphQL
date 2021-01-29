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
        // origin: (origin, callback) => {
        //     const whitelist = [
        //         "http://192.168.100.26:3000",
        //         "http://localhost:3000",
        //     ];

        //     if (whitelist.indexOf(origin) !== -1) {
        //         callback(null, true);
        //     } else {
        //         callback(new Error("Not allowed by CORS"));
        //     }
        // },
    },
});

server.applyMiddleware({ app });

if (process.env.NODE_ENV === "production") {
    app.get("*", (req, res) =>
        res.sendFile(path.join(__dirname, "client", "build", "index.html"))
    );
} else {
    app.get("/", (req, res) => {
        res.send("API is running...");
    });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(
        `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
    );
    console.log(
        `🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`
    );
});
