import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "./AppContext";
import FetchToken from "./functions/FetchToken";
import jwt_decode from "jwt-decode"
import AppSettings from "./AppSettings";
import Fetch from "./functions/Fetch";
import useLocalStorage from "./hooks/useLocalStorage"

//HACK: jwt_decode doesn't parse our nested objects
function parseNested(claims, name) {
  if (claims && typeof claims[name] === 'string' && claims[name].length > 0) {
    claims[name] = JSON.parse(claims[name])
  }
}

function isLocal() {
  return location.hostname === "localhost" || location.hostname === "127.0.0.1"
}

export default function AppState({ children }) {
  const [token, setToken] = useState(null);
  const [claims, setClaims] = useState({});
  const [localToken, setLocalToken] = useLocalStorage("token", "")
  const navigate = useNavigate();

  const assignToken = jwt => {
    var claims = jwt_decode(jwt)
    parseNested(claims, 'Customer')
    setToken(jwt)
    setClaims(claims)
  }

  const login = (email, password) => {
    //Localhost implicit login
    if (isLocal() && localToken && !email) {
      console.log("using localstorage token")
      assignToken(localToken)
      return new Promise(function (resolve) {
        resolve(localToken)
      })
    }

    // Normal login
    console.log("Login")
    return FetchToken(email, password).then(jwt => {
      assignToken(jwt)
      if (isLocal()) {
        setLocalToken(jwt)
      }
    })
  }

  useEffect(() => {
    // Ignore implicit login when token already defined
    if (token) {
      return
    }

    console.log("Implicit login")
      login()
  }, [token])

  const logout = () => {
    console.log("Logout")

    // Logout of server to clear cookie
    Fetch(AppSettings.Urls.Logout, { method: 'POST' }, token)

    // clear localToken if running locally
    if (isLocal()) {
      console.log("Clearing localstorage token")
      setLocalToken("")
    }

    // Setting token null triggers useEffect to reauthenticate as an anonymous user
    setToken(null)
    setClaims({})

    // Not required, but redirect to home seems reasonable
    navigate("/")
  }

  return (
    <AppContext.Provider
      value={{
        token: token,
        claims: claims,
        email: claims ? claims.UserName : "",
        login: login,
        logout: logout
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
