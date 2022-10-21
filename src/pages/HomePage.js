import React, { useContext } from "react"
import { Navigate  } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"
import { DataContext } from "../context/DataContext"

export default function HomePage() {
  const { claims } = useContext(AuthContext)
  const { count, increment } = useContext(DataContext)

  // HACK: web.config rewrite rules weren't passing subpaths, just rewriting to home page
  // so, the rewrite rule was rewritten to pass the subpaths as an argument
  // The code below, parse those arguments and redirects to that page.
  if (window.location.search.startsWith('?path=')) {
    const redirectPath = window.location.search.substring(6).replace("&", "?")
    console.log("REDIRECT", redirectPath)
    return <Navigate to={redirectPath} replace={true} />
  }

  return (
    <div>
      <h1>Home</h1>
      <pre><b>CLAIMS:&nbsp;</b>
        {JSON.stringify(claims, null, 4)}</pre>
      <h1>{count} <button onClick={increment}>+</button></h1>
    </div>
  );
}
