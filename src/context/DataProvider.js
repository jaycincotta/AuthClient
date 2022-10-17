import React, { useContext, useState } from "react"
import { DataContext } from "./DataContext"

export default function DataProvider({children}) {
    const [count, setCount] = useState(0)

    return (
        <DataContext.Provider
            value={{
                count: count,
                increment: () => setCount(count + 1)
            }}
        >
            {children}
        </DataContext.Provider>
    )
}
