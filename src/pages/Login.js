import React, { useState, useContext } from "react"
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppContext } from "../AppContext"
import { useFormik } from "formik";
import * as Yup from 'yup';

export default function Login() {
  const { login } = useContext(AppContext)
  const [errorMsg, setErrorMsg] = useState("")
  const [params] = useSearchParams()
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email is required").email("Email is invalid"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters")
      .max(40, "Password must not exceed 40 characters"),
  })

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (data) => {
      console.log("SUBMIT", data)
      const url = params.get('returnUrl') ?? "/"
      login(data.email, data.password)
        .then(() => navigate(url))
        .catch(e => {
          setErrorMsg(e.statusCode + ": " + e.message)
        })
    },
  });

  const denullify = value => value ? value : ""
  const ifError = (name, yes, no) => formik.errors[name] && formik.touched[name] ? denullify(yes) : denullify(no)

  const Error = ({ name }) => <div className="errorMessage">
    {formik.errors[name] && formik.touched[name] ? formik.errors[name] : ""}
  </div>

  return (
    <div className="login">
      <h1>Login</h1>
      <form onSubmit={formik.handleSubmit}>
        {errorMsg && <div className="errorMessage">{errorMsg}</div>}
        <fieldset>
          <label>Email:</label>
          <div>
            <input autoFocus name="email" type="text"
              className={ifError("email", "errorMessage")}
              onChange={formik.handleChange}
              value={formik.values.email}
            />
            <Error name="email" />
          </div>
          <label>Password:</label>
          <div>
            <input name="password" type="password"
              className={ifError("password", "errorMessage")}
              onChange={formik.handleChange}
              value={formik.values.password}
            />
            <Error name="password" />
          </div>
        </fieldset>
        {/* <button onClick={clickHandler}>Login</button> */}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
