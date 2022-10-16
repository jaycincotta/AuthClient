import React, { useContext } from "react"
import { AppContext } from "../AppContext"

export default function HomePage() {
  const { token, claims } = useContext(AppContext)
  return (
    <div>
      <h1>Home</h1>
      <pre><b>CLAIMS:&nbsp;</b>
        {JSON.stringify(claims, null, 4)}</pre>
    </div>
  );
}
