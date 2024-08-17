const baseURL = 'http://localhost:8000/character'
const endpoints = {
    retrieve_avatars: '/get-avatars',
    create: '/create'
}

export const getAvatars = async () => {
    let resp = await fetch(`${baseURL}${endpoints.retrieve_avatars}`)
    return resp.json()
}