const baseURL = 'http://localhost:8000/auth'
const endpoints = {
    register: '/register',
    login: '/login'
}

export const registerUser = async(userData) => {
    await fetch(`${baseURL}${endpoints.register}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(userData)
    })
}

export const loginUser = async(userData) => {
    await fetch(`${baseURL}${endpoints.login}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(userData)
    })
}