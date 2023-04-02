export const USER_LOGIN = "USER_LOGIN";
export const USER_LOGOUT = "USER_LOGOUT";

export const userLogin = (params) => ({ type: USER_LOGIN, params });
export const userLogout = (params) => ({ type: USER_LOGOUT, params });
