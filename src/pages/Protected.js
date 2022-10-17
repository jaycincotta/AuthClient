import React, { useState, useContext, useEffect } from "react"
import { AppContext } from "../AppContext"
import AppSettings from "../AppSettings"
import FetchSecure from "../functions/FetchSecure"
import Data from "../components/Data";

export default function Protected() {
    const { token, authenticate } = useContext(AppContext)
    const [part, setPart] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        FetchSecure(AppSettings.Urls.Protected, null, token, authenticate)
            .then(data => setPart(data))
            .catch(e => setError(e.message))
    }, []);

    return (
        <div>
            <h1>Protected Page</h1>
            <Data data={part} error={error}>
                <pre>{JSON.stringify(part, null, 4)}</pre>
            </Data>
        </div>
    )
}
