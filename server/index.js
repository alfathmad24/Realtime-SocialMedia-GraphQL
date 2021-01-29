const { ApolloServer, PubSub } = require("apollo-server");
const mongoose = require("mongoose");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers/index");

const { MONGODB } = require("./config");

const pubsub = new PubSub();

const PORT = process.env.PORT || 5000;

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

mongoose
    .connect(MONGODB, {
        useNewUrlParser: true,
    })
    .then(() => {
        console.log(`MongoDB connected`);
        return server.listen({ port: PORT });
    })
    .then((res) => {
        console.log(`Server running at ${res.url}`);
    })
    .catch((err) => {
        console.log(err);
    });