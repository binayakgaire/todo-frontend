import "./App.css";
import { useState } from "react";
import Login from "./pages/Auth/Login";
import Navbar from "./components/Navbar";
import Register from "./pages/Auth/Register";

// Todo
import TodoCreate from "./pages/Todo/TodoCreate";
import TodoEdit from "./pages/Todo/TodoEdit";
import Todo from "./pages/Todo/Todo";

import { BrowserRouter, Route, Switch } from "react-router-dom";

import { ProtectedRoute } from "./components/ProtectedRoute";
import { isLoggedIn } from "./utils/auth";

function App() {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn())


  return (
    <div className="App">
      <Navbar loggedIn={loggedIn}/>
      <header>
        <BrowserRouter>
          <Switch>
            <Route path="/login" component={(props) => <Login {...props} setLoggedIn={setLoggedIn}/>} />

            <Route path="/register" component={Register} />

            <ProtectedRoute path="/todo/create" component={TodoCreate} />

            <ProtectedRoute path="/todo/edit/:id" component={TodoEdit} />

            <ProtectedRoute path="/" component={Todo} />

            <Route path="*" compontent={() => "404 Not found"} />
          </Switch>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
