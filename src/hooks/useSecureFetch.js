import { useContext, useEffect } from "react";
import { AppContext } from "./AppContext";
import { useNavigate } from "react-router-dom";
import Fetch from "../functions/Fetch";

function Authenticate() {
    const navigate = useNavigate()
    const currentUrl = window.location.pathname + window.location.search
    const url = "/login?returnUrl=" + currentUrl
    navigate(url)
}

function SecureFetch(url, options) {
    const { token } = useContext(AppContext)

    useEffect(() => {
        // delays call until initial authentication complete
        if (!token) return;

        Fetch(AppSettings.Urls.Part, null, token)
            .then(res => res.json())
            .then(data => setPart(data))
            .catch(e => {
                if (e.statusCode === 401) {
                    console.log("Awaiting login")
                } else {
                    console.log("ERROR:", e)
                }
            })
    }, [token]);
}

export default function useSecureFetch(url, options) {
    const { token } = useContext(AppContext)

    useEffect(() => {
        // delays call until initial authentication complete
        if (!token) return;

        Fetch(AppSettings.Urls.Part, null, token)
            .then(res => res.json())
            .then(data => setPart(data))
            .catch(e => {
                if (e.statusCode === 401) {
                    console.log("Awaiting login")
                } else {
                    console.log("ERROR:", e)
                }
            })
    }, [token]);

    return Fetch(url, options, token)
        .then(res => res.json())
        .catch(e => {
            if (e.statusCode === 200) {
                Authenticate()
            } else {
                throw (e)
            }
        })
}