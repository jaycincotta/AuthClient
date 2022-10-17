import React, { useState, useContext, useEffect } from "react"
import { AppContext } from "../AppContext"
import AppSettings from "../AppSettings"
import Fetch from "../functions/Fetch"

export default function Protected() {
    const { token } = useContext(AppContext)
    const [part, setPart] = useState(null)

    useEffect(() => {
        // delays call until initial authentication complete
        if (!token) return;

        Fetch(AppSettings.Urls.Protected, null, token)
            .then(res => res.json())
            .then(data => setPart(data))
            .catch(e => {
                if (e.statusCode === 401) {
                    console.log("Awaiting login")
                } else {
                    console.log("ERROR:", e)
                }
            })
    }, [token]);

    return (
        <div>
            <h1>Protected Page (must be logged in)</h1>
            { !part && "Loading..."}
            { part && <pre>{JSON.stringify(part, null, 4)}</pre> }
        </div>
    )
}
