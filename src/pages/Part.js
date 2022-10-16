import React, { useState, useContext, useEffect } from "react"
import { AppContext } from "../AppContext"
import AppSettings from "../AppSettings"
import Fetch from "../functions/Fetch"

export default function Part() {
    const { token } = useContext(AppContext)
    const [part, setPart] = useState(null)

    useEffect(() => {
        if (!token) return;

        Fetch(AppSettings.Urls.Part, null, token)
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
            <h1>Part</h1>
            { !part && "Loading..."}
            { part && <pre>{JSON.stringify(part, null, 4)}</pre> }
        </div>
    )
}