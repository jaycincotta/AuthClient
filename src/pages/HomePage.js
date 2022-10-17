import React, { useContext } from "react"
import { AppContext } from "../AppContext"
import { DataContext } from "../test/DataContext"

export default function HomePage() {
  const { token, claims } = useContext(AppContext)
  const { count, increment } = useContext(DataContext)
  console.log("Render HomePage")
  return (
    <div>
      <h1>Home</h1>
      <pre><b>CLAIMS:&nbsp;</b>
        {JSON.stringify(claims, null, 4)}</pre>
      <h1>{count} <button onClick={increment}>+</button></h1>
    </div>
  );
}
