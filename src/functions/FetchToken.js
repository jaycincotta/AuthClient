import AppSettings from "../AppSettings"
import Fetch from "./Fetch"

// FetchToken builds on Fetch to call auth endpoint and return a JWT
// including stripping off quote characters.
export default async function FetchToken(email, password, token) {
    const options = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'ApiKey': AppSettings.ApiKey
        }
    }
    if (email) {
        options.body = JSON.stringify({
            UserName: email,
            Password: password,
            RememberMe: false
        })
    }

    return Fetch(AppSettings.Urls.Login, options, token)
        .then(res => res ? res.text() : null)
        .then(jwt => jwt ? jwt.replace(/['"]+/g, '') : null)
}