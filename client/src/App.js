import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Container } from "semantic-ui-react";

import "semantic-ui-css/semantic.min.css";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SinglePost from "./pages/SinglePost";
import MenuBar from "./components/MenuBar";
import { AuthContext, AuthProvider } from "./context/auth";
import AuthRoute from "./util/AuthRoute";

function App() {
    const { user, logout } = useContext(AuthContext);

    useEffect(() => {
        if (user) {
            logout();
        }
    }, [user, logout]);

    return (
        <AuthProvider>
            <Container>
                <Router>
                    <MenuBar />
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <AuthRoute exact path="/login" component={Login} />
                        <AuthRoute
                            exact
                            path="/register"
                            component={Register}
                        />
                        <Route
                            exact
                            path="/posts/:postId"
                            component={SinglePost}
                        />
                        {/* <Route component={Home} /> */}
                    </Switch>
                </Router>
            </Container>
        </AuthProvider>
    );
}

export default App;
