import React, { useState, useContext, useEffect } from "react"
import { AuthContext } from "../AuthContext"
import AppSettings from "../AppSettings"
import DataView from "../components/DataView";

export default function Protected() {
    const { fetch } = useContext(AuthContext)
    const [part, setPart] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetch(AppSettings.Urls.Protected)
            .then(data => setPart(data))
            .catch(e => setError(e.message))
    }, []);

    return (
        <div>
            <h1>Protected Page</h1>
            <DataView data={part} error={error}>
                <pre>{JSON.stringify(part, null, 4)}</pre>
            </DataView>
        </div>
    )
}
