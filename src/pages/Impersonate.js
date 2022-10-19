import React, { useState, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import AppSettings from "../AppSettings"
import { useFormik } from "formik";
import * as Yup from 'yup';

export default function Impersonate() {
    const { fetch, claims } = useContext(AuthContext)
    const [errorMsg, setErrorMsg] = useState("")

    const impersonate = custId => {
        fetch(AppSettings.Urls.Impersonate(custId))
            .then(res => res.json())
            .catch(e => { setErrorMsg(e.message) })
    }

    const validationSchema = Yup.object().shape({
        custId: Yup.string()
            .required("CustId is required")
            .min(6, "CustId must be at least 6 characters")
            .max(15, "CustId must not exceed 15 characters"),
    })

    const formik = useFormik({
        initialValues: {
            custId: ""
        },
        validationSchema,
        validateOnChange: false,
        validateOnBlur: false,
        onSubmit: data => {
            console.log("SUBMIT!")
            impersonate(data.custId)
        }
    })

    const customer = claims && claims.Customer && claims.Customer.Id
        ? claims.Customer.Id + ": " + claims.Customer.Name : ""

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
                    <label>CustId:</label>
                    <div>
                        <input autoFocus name="custId" type="text"
                            className={ifError("custId", "errorMessage")}
                            onChange={formik.handleChange}
                            value={formik.values.custId}
                        />
                        <Error name="custId" />
                    </div>
                </fieldset>
                <div className="flex">
                <button type="submit">Impersonate</button>
                {customer && <button onClick={() => impersonate()}>Cancel</button>}
                </div>
            </form>
        </div>
    )
}
