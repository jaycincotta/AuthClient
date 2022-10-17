import React from "react"

export default function Data({ data, error, children }) {
    return (<>
        {error && <div className="errorMessage">{error}</div>}
        {!error && !data && "Loading..."}
        {!error && data && <>{children}</>}
    </>)
}