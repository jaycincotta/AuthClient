import Fetch from "./Fetch";

function Authenticate(navigate) {
    const currentUrl = window.location.pathname + window.location.search
    const url = "/login?returnUrl=" + currentUrl
    navigate(url)
}

export default function FetchSecure(url, options, token, navigate) {
    return Fetch(url, options, token)
        .then(res => res.json())
        .catch(e => {
            if (e.statusCode === 403) {
                Authenticate(navigate)
            } else {
                console.log("ERROR", e.statusCode, e.message)
                throw e
            }
        })
}