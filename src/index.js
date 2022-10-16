import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

// StrictMode can be helpful for finding subtle React bugs such as side effects
// But, this can also be confusing becase React StrictMode renders components twice on dev server
// The link below discusses the pros/cons in more detail
// https://stackoverflow.com/a/72238236
root.render(
  //<React.StrictMode>
    <App />
  //</React.StrictMode>
);
