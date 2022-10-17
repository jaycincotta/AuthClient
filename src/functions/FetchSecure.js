import Fetch from "./Fetch";

export default function FetchSecure(url, options, token, authenticate) {
    return Fetch(url, options, token)
        .then(res => res.json())
        .catch(e => {
            if (e.statusCode === 403 && authenticate) {
                authenticate()
            } else {
                console.log("ERROR", e.statusCode, e.message)
                throw e
            }
        })
}