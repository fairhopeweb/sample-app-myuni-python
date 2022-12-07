import { handleError } from "./apiHelper";
import history from "./history";
import axios from './interceptors';

export async function codeGrantAuth(redirectUrl) {
    try {
        localStorage.setItem("redirectUrl", redirectUrl);
        await axios.get(
            process.env.REACT_APP_API_BASE_URL + "/code_grant_auth"
        );
    } catch (error){
        handleError(error);
    }
}

export async function callback() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const response = await axios.post(
            process.env.REACT_APP_API_BASE_URL + "/callback",
            {
                code: code
            },
            {
                withCredentials: true
            }
        );
        return response.data.message
    } catch (error) {
        history.push("/");
        handleError(error);
    }
}

export async function logOut() {
    try {
        await axios.post(
            process.env.REACT_APP_API_BASE_URL + "/logout",
            {
                
            },
            {
                withCredentials: true
            }
        );
    } catch (error) {
        history.push('/');
        handleError(error);
    }
}

export async function getStatus(setStatus, setAuthType) {
    try {
        let response = await axios.get(
            process.env.REACT_APP_API_BASE_URL + "/get_status",
            {
                withCredentials: true
            }
        );
        setStatus(response.data.logged);
        setAuthType(response.data.auth_type);
    } catch (error) {
        handleError(error);
    }
}

export async function jwtAuth() {
    try {
        await axios.get(
            process.env.REACT_APP_API_BASE_URL + "/jwt_auth",
            {
                withCredentials: true
            }
        );
    } catch (error){
        history.push('/');
        handleError(error);
    }
}

export async function checkUnlogged(logged, setStatus, setAuthType) {
    if (!logged) {
        await jwtAuth();
        await getStatus(setStatus, setAuthType)
    }
}

export async function completeCallback(setShowAlert, setStatus, setAuthType, setShowJWTModal) {
    try {
        const message = await callback();
        const redirectUrl = localStorage.getItem("redirectUrl")
        
        getStatus(setStatus, setAuthType);
        if (message === "Logged in with JWT") {
            setShowAlert(true);
        }
        else if (redirectUrl === '/requestExtracurricularActivity') {
            await checkPayment(setShowJWTModal);
        }
        history.push(redirectUrl);
    } catch (error){
        handleError(error, setShowJWTModal)
    }
}

export async function checkPayment(setShowJWTModal) {
    try {
        const response = await axios.get(
            process.env.REACT_APP_API_BASE_URL + "/check_payment",
            {
                withCredentials: true
            }
        );
        return response;
    } catch (error){
        history.push('/');
        handleError(error, setShowJWTModal);
    }
}