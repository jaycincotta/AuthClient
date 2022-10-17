import React, { useState, useContext, useEffect } from "react"
import { AuthContext } from "../AuthContext"
import { DataContext } from "../test/DataContext"
import AppSettings from "../AppSettings"
import Fetch from "../functions/Fetch"

export default function Public() {
    const { token } = useContext(AuthContext)
    const { count, increment } = useContext(DataContext)
    const [part, setPart] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        Fetch(AppSettings.Urls.Public, null, token)
            .then(res => res.json())
            .then(data => setPart(data))
            .catch(e => {
                console.log("ERROR", e.statusCode, e.message)
                setError(e.message)
            })
    }, []);

    return (
        <div>
            <h1>Public Page</h1>
            { error && <div className="errorMessage">{error}</div>}
            { !error && !part && "Loading..."}
            { !error && part && <pre>{JSON.stringify(part, null, 4)}</pre> }
            <h1>{count} <button onClick={increment}>+</button></h1>
        </div>
    )
}
