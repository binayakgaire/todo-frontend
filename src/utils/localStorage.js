export const storeToken = token => {
    localStorage.setItem('token', token);
}

export const removeToken = _ => {
    localStorage.removeItem('token');
}

export const getToken = _ => {
    return localStorage.getItem('token');
}