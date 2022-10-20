import React, { useState, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { useFormik } from "formik";
import * as Yup from 'yup';

export default function Impersonate() {
    const { impersonate, claims, userType, authenticate } = useContext(AuthContext)
    const [errorMsg, setErrorMsg] = useState("")

    // This will redirect to the Login page, then redirect back here
    // after successfull login
    if (userType !== "Employee") {
        authenticate()
    }

    const validationSchema = Yup.object().shape({
        email: Yup.string().required("Email is required").email("Email is invalid")
    })

    const formik = useFormik({
        initialValues: {
            email: ""
        },
        validationSchema,
        validateOnChange: false,
        validateOnBlur: false,
        onSubmit: data => {
            impersonate(data.email)
                .catch(e => setErrorMsg(e.message))
        }
    })

    const cancelImpersonation = e => {
        e.preventDefault();
        impersonate()
        .catch(e => setErrorMsg(e.message))
    }

    const customer = claims && claims.Customer && claims.Customer.UserName
        ? claims.Customer.UserName : ""

    const denullify = value => value ? value : ""
    const ifError = (name, yes, no) => formik.errors[name] && formik.touched[name] ? denullify(yes) : denullify(no)
    const Error = ({ name }) => <div className="errorMessage">
        {formik.errors[name] && formik.touched[name] ? formik.errors[name] : ""}
    </div>

    return (
        <div>
            <h1>Impersonate Page</h1>
            {customer && <p>Currently impersonating: {customer}</p>}
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
                </fieldset>
                <div className="flex">
                    <button type="submit">Impersonate</button>
                    {customer && <button onClick={cancelImpersonation}>Cancel</button>}
                </div>
            </form>
        </div>
    )
}
