import logo from "./logo.svg";
import "./App.css";
import React, { Component } from "react";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./core/login/Login";
import Sale from "./components/sales"
function App() {
  return (
    <div>
      <Router>
        <div>
          <Switch>
            <Route path="/" exact component={Login}></Route>
            <Route path = "/sales" component = {Sale}></Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
