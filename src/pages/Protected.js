import React, { useState, useContext, useEffect } from "react"
import { AppContext } from "../AppContext"
import AppSettings from "../AppSettings"
import Fetch from "../functions/Fetch"
import { useNavigate } from "react-router-dom";

export default function Protected() {
    const { token } = useContext(AppContext)
    const [part, setPart] = useState(null)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    function Authenticate() {
        const currentUrl = window.location.pathname + window.location.search
        const url = "/login?returnUrl=" + currentUrl
        console.log("URL", url)
        navigate(url)
    }

    useEffect(() => {
        Fetch(AppSettings.Urls.Protected, null, token)
            .then(res => res.json())
            .then(data => setPart(data))
            .catch(e => {
                if (e.statusCode === 403) {
                    Authenticate()
                } else {
                    console.log("ERROR", e.statusCode, e.message)
                    setError(e.message)
                }
            })
    }, []);

    return (
        <div>
            <h1>Protected Page</h1>
            {error && <div className="errorMessage">{error}</div>}
            {!error && !part && "Loading..."}
            {!error && part && <pre>{JSON.stringify(part, null, 4)}</pre>}
        </div>
    )
}
