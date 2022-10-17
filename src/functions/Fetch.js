import FetchError from "./FetchError";

// Fetch adds error handling to fetch
// For status >= 400, Fetch throws a FetchError using either
// the body text (if any) or statusText or generic text if both are falsy
// It includes an optional token parameter to be passed in an authorization header
export default async function Fetch(url, options, token) {
    if (!options) options = { method: 'GET' }
    if (!options.headers && token) options.headers = {}
    if (token) options.headers.Authorization = "Bearer " + token
    console.log(options.method, url)

    return fetch(url, options)
        .then(async res => {
            if (res.status <= 400) { return res }
            else {
                // use await vs then() to block other async branches
                // https://dev.to/masteringjs/using-then-vs-async-await-in-javascript-2pma
                let text = await res.text()
                var message = text ? String(text).replace(/['"]+/g, '')
                    : res.statusText ? res.statusText
                        : 'Unexpected Error'
                throw new FetchError(res.status, message)
            }
        })
}