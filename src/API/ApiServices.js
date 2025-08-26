import axios from "axios";
import { store } from "../redux/store";
import { getAccessTokenAction, logout } from "../redux/authSlice";
const url = import.meta.env.VITE_REACT_APP_API_URL;
const MT5url = import.meta.env.VITE_REACT_APP_MT5_API_URL;

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
axios.defaults.xsrfHeaderName = "X-CSRFToken"
axios.defaults.xsrfCookieName = "csrftoken"
const config = {
    'Content-Type': 'application/json',
}
const createAPI = axios.create({ baseURL: url ,headers:config})

const createMT5API = axios.create({ baseURL: MT5url ,headers:config})

  // ---------------- Attach Token on Requests ----------------
const attachAuth = (instance) => {
  instance.interceptors.request.use(
    (config) => {
      const state = store.getState();
      const { isLoggedIn, data } = state.auth || {};
      if (config.url?.includes("accounts/token/refresh/")) {
        return config;
      }

      if (isLoggedIn && data?.access_token) {
        config.headers.Authorization = `Bearer ${data.access_token}`;
      } else {
        if (!config.url?.includes("accounts/get-client-details/")) {
        delete config.headers.Authorization;
        }
      }

      return config;
    },
    (error) => Promise.reject(error)
  );
};

attachAuth(createAPI);
attachAuth(createMT5API);

const attachRefreshOn401 = (instance) => {
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (originalRequest?.url?.includes("accounts/")) {
        return Promise.reject(error);
      }
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const state = store.getState();
          const refreshToken = state.auth?.data?.refresh_token;
          const isLoggedIn = state.auth?.isLoggedIn
          if (refreshToken && isLoggedIn) {
            // call your refresh API
            const res = await GET_ACCESS_TOKEN_API({ refresh: refreshToken });

            const newToken = res.data.access; // adjust to match your backend response

            // update redux (you can dispatch an action here)
            store.dispatch(getAccessTokenAction({
             access_token: newToken 
            }));

            // ✅ Retry the original request with new token
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return instance(originalRequest);
          }
        } catch (refreshError) {
          console.error("Token refresh failed", refreshError);
          store.dispatch(logout()); 
          // window.location.href = "/login";
        }
      }

      return Promise.reject(error);
    }
  );
};

attachRefreshOn401(createAPI);
// attachRefreshOn401(createMT5API);


export const LOGIN_USER_API = async (data) => {
    const response = await createAPI.post("accounts/login/", data)
    return response;
}
export const REGISTER_USER_API = async (data) => {
    const response = await createAPI.post("accounts/user/", data)
    return response;
}
export const REGISTER_MT5_USER_API = async (data) => {
    const response = await createAPI.post("accounts/create-mt5-user/", data)
    return response;
}
export const GET_CLIENT_DETAILS_API = async (data) => {
    const response = await createAPI.get("accounts/get-client-details/",{headers:{Authorization: `Bearer ${data.access_token}`}})
    return response;
}
export const POST_SELECTED_SYMBOLS_API = async (data) => {
  const response = await createAPI.post("instruments/", data)
  return response;
}
export const GET_SELECTED_SYMBOLS_API = async () => {
  const response = await createAPI.get("instruments/")
  return response;
}

export const GET_ACCESS_TOKEN_API = async (data) => {
  const response = await createAPI.post("accounts/token/refresh/", data)
  return response;
}
//-----------------------------------mt5--------------------//

export const MARKET_ORDER_API = async (data) => {
    const response = await createMT5API.post("trade/market-order/",data)
    // window.user = response.data.username
    return response;
}
export const LIMIT_ORDER_API = async (data) => {
    const response = await createMT5API.post("trade/limit-order/",data)
    // window.user = response.data.username
    return response;
}
export const OPEN_POSITION_API = async(client_id) => {
  const response = await createMT5API.get(`position/get-open-position/?client_id=${client_id}`)
  // window.user = response.data.username
  return response;
}
export const PENDING_ORDER_API= async(client_id) => {
  const response = await createMT5API.get(`trade/pending-order/?client_id=${client_id}`)
  return response
}
export const GET_SYMBOL_API= async() => {
  const response = await createMT5API.get(`symbol/fetch-symbols/`)
  return response
}
export const CLOSED_ORDER_API = async(data) =>{
  const response = await createMT5API.post(`/deal/get-deals/`,data)
  return response
}
export const DELETE_OPEN_ORDER =async(data) =>{
  const response = await createMT5API.post(`position/close-position/`,data)
  return response
}
export const DELETE_PENDING_ORDER = async(data) => {
  const response = await createMT5API.post(`/trade/delete-pending-order/`,data)
  return response
}
export const EDIT_OPEN_ORDER =async(data) =>{
  const response = await createMT5API.post(`position/modify-position/`,data)
  return response
}
export const EDIT_PENDING_ORDER = async(data) =>{
  const response = await createMT5API.post(`trade/modify-order/`,data)
  return response
}
export const GET_ACCOUNT_DETAILS = async() => {
  const response = await createAPI.get(`trade/account-details/`);
  console.log("api response",response)
  return response;
}