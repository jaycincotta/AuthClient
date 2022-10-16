import React, { useState, useContext } from "react"
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppContext } from "../AppContext"

export default function Login() {
  const { login } = useContext(AppContext)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [params] = useSearchParams()
  const navigate = useNavigate();

  const clickHandler = (e) => {
    // https://bobbyhadz.com/blog/react-prevent-form-submit
    e.preventDefault();

    const url = params.get('returnUrl') ?? "/"
    login(email, password)
    .then(() => navigate(url))
    .catch(e => {
      setErrorMsg(e.statusCode + ": " + e.message)
    })
  }

  return (
    <div className="login">
      <h1>Login</h1>
      <form onSubmit={clickHandler}>
      {errorMsg && <div className="errorMessage">{errorMsg}</div>}
      <fieldset>
        <label>Email:</label>
        <input autoFocus value={email} onChange={(e) => setEmail(e.target.value)} />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </fieldset>
      {/* <button onClick={clickHandler}>Login</button> */}
      <button type="submit">Login</button>
      </form>
    </div>
  );
}
