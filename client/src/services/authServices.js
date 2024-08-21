const baseURL = 'http://localhost:8000/auth'
const endpoints = {
    register: '/register',
    login: '/login',
    getSession: '/get-session'
}

export const registerUser = async(userData) => {
    let resp = await fetch(`${baseURL}${endpoints.register}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(userData)
        })
        return resp
}

export const loginUser = async(userData) => {
    let resp =  await fetch(`${baseURL}${endpoints.login}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(userData),
            credentials: 'include'
        })
        return resp
}

export const getSessionInfo = async () => {
    let resp = await fetch(`${baseURL}${endpoints.getSession}`, {
        method: 'GET',
        credentials: 'include'
    })
    return resp.json()
}