import React, { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { DataContext } from "../context/DataContext"

export default function HomePage() {
  const { claims } = useContext(AuthContext)
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
