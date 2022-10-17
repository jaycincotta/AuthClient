import React, { useState, useContext, useEffect } from "react"
import { AppContext } from "../AppContext"
import AppSettings from "../AppSettings"
import FetchSecure from "../functions/FetchSecure"
import { useNavigate } from "react-router-dom";
import Data from "../components/Data";

export default function Protected() {
    const { token } = useContext(AppContext)
    const navigate = useNavigate()
    const [part, setPart] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        FetchSecure(AppSettings.Urls.Protected, null, token, navigate)
            .then(data => setPart(data))
            .catch(e => {
                setError(e.message)
            })
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
