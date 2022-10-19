import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import jwt_decode from "jwt-decode"
import AppSettings from "../AppSettings";
import useLocalStorage from "../hooks/useLocalStorage"

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(null)
  const [initialized, setInitialized] = useState("")
  const [claims, setClaims] = useState({})
  const [localToken, setLocalToken] = useLocalStorage("token", "")
  const navigate = useNavigate()
  const location = useLocation()

  console.log("INIT", process.env.NODE_ENV)

  //#region Fetch extensions

  //#region fancyFetch plus related helpers

  // Extends Error to include statusCode
  class FetchError extends Error {
    constructor(statusCode, message) {
      super(message)
      this.name = "FetchError"
      this.statusCode = statusCode
    }
  }

  // Provides default error messages for common status codes
  function defaultErrorMessage(status, url) {
    switch (status) {
      case 401: return "You are not authenticated"
      case 403: return "You do not have permission to access this page"
      case 404: return "Page does not exist: " + url
      default: return "Unexpected Error"
    }
  }

  const authenticate = () => {
    const currentUrl = location.pathname + location.search
    const url = "/login?returnUrl=" + currentUrl
    console.log("Redirect", url)
    navigate(url)
  }

  const fancyFetch = (url, options) => {
    return fetch(url, options)
      .then(async res => {
        if (res.status <= 400) { return res }
        else {
          // use await vs then() to block other async branches
          // https://dev.to/masteringjs/using-then-vs-async-await-in-javascript-2pma
          let text = await res.text()
          var message = text ? String(text).replace(/['"]+/g, '')
            : res.statusText ? res.statusText
              : defaultErrorMessage(res.status, url)
          throw new FetchError(res.status, message)
        }
      })
      .catch(e => {
        if (e.statusCode === 403) {
          authenticate()
        } else {
          throw e
        }
      })
  }

  //#endregion fancyFetch plus related helpers

  const fancyFetchWithRetry = (url, options) => {
    if (!options) options = { method: 'GET' }
    if (!options.headers && token) options.headers = {}
    if (token) options.headers.Authorization = "Bearer " + token
    console.log(options.method, url)

    return fancyFetch(url, options)
      .catch(e => {
        if (e.statusCode === 401) {
          return login()
            .then(newToken => { options.headers.Authorization = "Bearer " + newToken })
            .then(() => fancyFetch(url, options))
            .catch(e => {
              console.log("ERROR on retry", e.statusCode, e.message)
              throw e
            })
        } else {
          console.log("ERROR", e.statusCode, e.message)
          throw e
        }
      })
  }

  // fetchToken is used by login to get JWT for user as a bearer token
  async function fetchToken(email, password) {
    const options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'ApiKey': process.env.REACT_APP_APIKEY
      }
    }
    if (email) {
      options.body = JSON.stringify({
        UserName: email,
        Password: password,
        RememberMe: false
      })
    }

    return fancyFetch(AppSettings.Urls.Login, options)
      .then(res => res ? res.text() : null)
      .then(jwt => jwt ? jwt.replace(/['"]+/g, '') : null)
  }

  //#endregion Fetch extensions

  //#region Login/Logout with related helpers

  function isLocal() {
    return location.hostname === "localhost" || location.hostname === "127.0.0.1"
  }

  //HACK: jwt_decode doesn't parse our nested objects
  function parseNested(claims, name) {
    if (claims && typeof claims[name] === 'string' && claims[name].length > 0) {
      claims[name] = JSON.parse(claims[name])
    }
  }

  const assignToken = jwt => {
    var claims = jwt_decode(jwt)
    parseNested(claims, 'Customer')
    setInitialized("OK")
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

      // For consistency with fetchToken, return a promise
      return new Promise(function (resolve) {
        resolve(localToken)
      })
    }

    // Normal login
    console.log("Login")
    return fetchToken(email, password)
      .then(jwt => {
        const claims = assignToken(jwt)
        if (isLocal() && claims.UserName) {
          setLocalToken(jwt)
        }
        return jwt
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
    fancyFetch(AppSettings.Urls.Logout, { method: 'POST' })
      .then(() => {
        // Setting token null triggers useEffect to reauthenticate as an anonymous user
        setToken(null)
        setClaims({})

        // Not required, but redirect to home seems reasonable
        navigate("/")
      })
  }

  //#endregion Login/Logout with related helpers

  useEffect(() => {
    // Ignore implicit login when token already defined
    if (token) {
      return
    }
    console.log("Implicit login")
    login()
      .catch(e => {
        setInitialized(e.message)
      })
  }, [token])

  return (
    <AuthContext.Provider
      value={{
        initialized: initialized,
        claims: claims,
        email: claims ? claims.UserName : "",
        login: login,
        logout: logout,
        fetch: fancyFetchWithRetry
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
