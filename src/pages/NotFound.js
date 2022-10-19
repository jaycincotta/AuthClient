import React from "react";

export default function NotFound() { 
  return (
    <div>
        <h1>Page Not Found</h1>
        <p>The requested page does not exist. Please check you path and try again.</p>
        <pre>{window.location.pathname}</pre>
    </div>
  );
}
