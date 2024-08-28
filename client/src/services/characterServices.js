const baseURL = 'http://localhost:8000/character'
const endpoints = {
    retrieve_avatars: '/get-avatars',
    create: '/create'
}

export const getAvatars = async () => {
    let resp = await fetch(`${baseURL}${endpoints.retrieve_avatars}`)
    return resp.json()
}

export const createCharacter = async (characterData) => {
    let resp = await fetch(`${baseURL}${endpoints.create}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(characterData),
        credentials: 'include'
    })
    return resp
}