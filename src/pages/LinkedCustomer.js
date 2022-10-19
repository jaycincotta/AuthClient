import React, { useState, useContext, useEffect } from "react"
import { AuthContext } from "../context/AuthContext"
import AppSettings from "../AppSettings"
import DataView from "../components/DataView";

export default function LinkedCustomer() {
    const { fetch } = useContext(AuthContext)
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetch(AppSettings.Urls.LinkedCustomer)
            .then(res => res.json())
            .then(data => setData(data))
            .catch(e => setError(e.message))
    }, []);

    return (
        <div>
            <h1>Linked Customer Page</h1>
            <DataView data={part} error={error}>
                <pre>{JSON.stringify(data, null, 4)}</pre>
            </DataView>
        </div>
    )
}
