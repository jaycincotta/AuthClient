import React, { useState, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { useFormik } from "formik";
import * as Yup from 'yup';
import AppSettings from "../AppSettings";

export default function Impersonate() {
    const { impersonate, claims, userType, authenticate, fetch } = useContext(AuthContext)
    const [errorMsg, setErrorMsg] = useState("")
    const [searchResults, setSearchResults] = useState([]);

    // This will redirect to the Login page, then redirect back here
    // after successfull login
    if (userType !== "Employee") {
        authenticate()
    }

    const validationSchema = Yup.object().shape({
        input: Yup.string().required("Input is required").min(3, "Minimum 3 characters is required")
    })

    const formik = useFormik({
        initialValues: {
            input: ""
        },
        validationSchema,
        validateOnChange: false,
        validateOnBlur: false,
        onSubmit: data => {
            fetch(AppSettings.Urls.ImpersonateSearch+data.input)
            .then(resp => resp.json())
            .then(data => setSearchResults(sort(data)))
            .catch(e => setErrorMsg(e.message))

        }
    })

    const sort = (data) => {
        return data.sort((a, b) => a.FirstName > b.FirstName ? 1 : -1)
    }

    const handleImpersonate = e => {
        impersonate(e.target.id)
            .catch(e => setErrorMsg(e.message))
    }

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
            <div className="flex">
                {customer && <p>Currently impersonating: {customer}</p>}
                {customer && <button onClick={cancelImpersonation}>Cancel</button>}
            </div>
            <form onSubmit={formik.handleSubmit}>
                {errorMsg && <div className="errorMessage">{errorMsg}</div>}
                <fieldset className="flex">
                    <label>Customer:</label>
                    <div>
                        <input autoFocus name="input" type="text"
                            className={ifError("input", "errorMessage")}
                            onChange={formik.handleChange}
                            value={formik.values.input}
                        />
                        <Error name="input" />
                    </div>
                    <button type="submit">Search</button>
                </fieldset>
                <SearchResults data={searchResults} onSelect={handleImpersonate}/>
                <pre>{JSON.stringify(searchResults, null, 4)}</pre>
            </form>
        </div>
    )
}


function SearchResults({ data, onSelect}) {
    const results = data.map(c => <Result key={c.Id} customer={c} onSelect={onSelect} />)
    return (
        <ul style={{margin:'0', padding: '0', listStyle: 'none'}}>
            {results}
        </ul>
    )
}

function Result({ customer, onSelect }){
    const format = (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
    }

    const name = `${format(customer.FirstName)} ${format(customer.LastName)}`;
    const email  = customer.UserName.toLowerCase();
    const account = `${customer.CustId} ${customer.CustName}`;

    const styles = {
        marginBottom: '5px', 
        border: '1px solid gray',
        padding: '5px 10px',
        width: 'auto'
    }

    return (
        <li className="flex" style={styles}>
            <button id={email} onClick={onSelect}>Impersonate</button>
            <div>
                <div><strong>Name:</strong> {name}</div>
                <div><strong>Email:</strong> {email}</div>
                <div><strong>Account:</strong> {account}</div>
            </div>
        </li>
    )
}