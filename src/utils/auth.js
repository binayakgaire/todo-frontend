import { getToken, removeToken } from "./localStorage";

export const isLoggedIn = () => (getToken() ? true : false);

export const logOut = () => { 
    removeToken();
};