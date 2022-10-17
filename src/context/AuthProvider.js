import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import FetchToken from "../functions/FetchToken";
import jwt_decode from "jwt-decode"
import AppSettings from "../AppSettings";
import Fetch from "../functions/Fetch";
import useLocalStorage from "../hooks/useLocalStorage"

//HACK: jwt_decode doesn't parse our nested objects
function parseNested(claims, name) {
  if (claims && typeof claims[name] === 'string' && claims[name].length > 0) {
    claims[name] = JSON.parse(claims[name])
  }
}

function isLocal() {
  return location.hostname === "localhost" || location.hostname === "127.0.0.1"
}

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(null)
  const [claims, setClaims] = useState({})
  const [localToken, setLocalToken] = useLocalStorage("token", "")
  const navigate = useNavigate()
  const location = useLocation()

  const assignToken = jwt => {
    var claims = jwt_decode(jwt)
    parseNested(claims, 'Customer')
    setToken(jwt)
    setClaims(claims)
    return claims
  }

  /*** LOGIN ***/
  const login = (email, password) => {
    //Localhost implicit login
    if (isLocal() && localToken && !email) {
      console.log("using localstorage token")
      assignToken(localToken)

      // For consistency with FetchToken, return a promise
      return new Promise(function (resolve) {
        resolve(localToken)
      })
    }

    // Normal login
    console.log("Login")
    return FetchToken(email, password).then(jwt => {
      const claims = assignToken(jwt)
      if (isLocal() && claims.UserName) {
        setLocalToken(jwt)
      }
    })
  }

  /*** LOGOUT ***/
   const logout = () => {
    console.log("Logout")

    // clear localToken if running locally
    if (isLocal()) {
      console.log("Clearing localstorage token")
      setLocalToken() // no parameter === undefined which triggers removeItem
    }

    // Logout of server to clear cookie
    Fetch(AppSettings.Urls.Logout, { method: 'POST' }, token)
      .then(() => {
        // Setting token null triggers useEffect to reauthenticate as an anonymous user
        setToken(null)
        setClaims({})

        // Not required, but redirect to home seems reasonable
        navigate("/")
      })
  }

  /*** FANCY FETCH ***/
    const authenticate = () => {
      const currentUrl = location.pathname + location.search
      const url = "/login?returnUrl=" + currentUrl
      console.log("Redirect", url)
      navigate(url)
    }

    const fancyFetch = (url, options) => {
      return Fetch(url, options, token)
      .then(res => res.json())
      .catch(e => {
          if (e.statusCode === 403 && authenticate) {
              authenticate()
          } else {
              console.log("ERROR", e.statusCode, e.message)
              throw e
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

  return (
    <AuthContext.Provider
      value={{
        token: token,
        claims: claims,
        email: claims ? claims.UserName : "",
        login: login,
        logout: logout,
        fetch: fancyFetch
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
