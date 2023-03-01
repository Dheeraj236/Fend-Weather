import React from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import Home from "./Home/Home";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import Forgot from "./Auth/Forgot";
import Reset from "./Auth/Reset";
import Profile from "./Profile/Profile";
import EditUser from "./Profile/EditUser";
import Error from "./Error/Error";

const URL = "https://live-weather-forecasting.onrender.com";
const Key = "08d082b236fd458698d125650210612";
const W_URL = "https://api.weatherapi.com/v1/current.json";
const clientId = '666200109799-dq9eu8pisg3iuhibts2oktjhct7i1v9r.apps.googleusercontent.com';
let DateNow = new Date(Date.now());

function RouteComponent() {
  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route exact path='/'>
            <Login URL={URL} clientId={clientId} />
          </Route>
          <Route exact path='/signup'>
            <Signup URL={URL} />
          </Route>
          <Route exact path='/forgotpassword'>
            <Forgot URL={URL} />
          </Route>
          <Route exact path='/reset/:token'>
            <Reset URL={URL} />
          </Route>
          <Route exact path='/home'>
            <Home URL={URL} W_URL={W_URL} Key={Key} DateNow={DateNow} />
          </Route>
          <Route exact path='/profile'>
            <Profile URL={URL} W_URL={W_URL} Key={Key} />
          </Route>
          <Route exact path='/profile/:userId'>
            <EditUser URL={URL} />
          </Route>
          <Route exact path='/*'>
            <Error />
          </Route>
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default RouteComponent;
