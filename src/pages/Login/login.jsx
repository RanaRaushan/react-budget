import React, { useEffect, useState } from 'react';
import Login, { Render } from 'react-login-page';
import './login.css';
import { Form, Link, useActionData, useLocation, useNavigate, useNavigation, useParams, useSearchParams } from 'react-router-dom';
import {auth_get_token, refresh_token} from '../../utils/APIHelper';
import { SpinnerDotted } from 'spinners-react';
import { useAuth } from '../../hooks/AuthProvider';
import { validateToken } from '../../utils/ValidateToken';


let REDIRECT_URL = "/auth/callback";

export async function action({ request }) {
    console.log("LoginPage || login action | start")
    const loginFormData = await request.formData();
    const loginData = Object.fromEntries(loginFormData);
    let response;
    let error;
    if (loginData && loginData.email && loginData.password) {
        response = await auth_get_token({"email":loginData.email, "password":loginData.password})
    } else {
        return {loginData:loginData, error: "Please enter data to login"};
    }
    if (response && response.event === "Error") {
        error = response.message
        return {loginData:loginData, error: error};
    }
    if (!response) {
        return {loginData:loginData, error: "Something went wrong! Please try again after some time..."};
    }
    console.log("LoginPage || login action | response", response)
    const expireAt = new Date().getTime() + Number(response.expires_in)
    return {loginData:loginData, tokenData:{"body":response, "expireAt":expireAt, "user":loginData.email}};
  }


const LoginPage = () => {
    console.log("LoginPage || calling LoginPage")
    const navigation = useNavigation();
    const actionData = useActionData();
    const navigate = useNavigate();
    // const location = useLocation();
    const [queryParams] = useSearchParams();
    const auth = useAuth();
    // const prevState = location.state;
    // const prevlocation = prevState?.redirectFrom;
    // console.log("actionData", actionData, location)
    useEffect(() => {
        const checkAuth = async () => {
            if (auth && auth.token && validateToken(auth.token)) {
            // Redirect to login or home page
                console.log("LoginPage || valid token found", auth)
                navigate('/', { replace: true });
            } else if (auth && auth.token && auth.token.body && !validateToken(auth.token) && auth.token.body.refreshToken) {
                console.log("LoginPage || token expired or invalid", auth)
                try {
                const res = await refresh_token({refreshToken:auth.token?.body?.refreshToken})
                // .then( (res) =>{
                console.log("LoginPage || res refresh token", res);
                const expireAt = new Date().getTime() + Number(res?.expires_in);
                const tokenData = res && {"body":res, "expireAt":expireAt, "user":auth.token?.user};
                auth.removeToken();
                res && navigate(`${REDIRECT_URL}?redirectTo=${queryParams.get("redirectTo")}`, { state: {tokenData:tokenData}, replace: true })
                // }
                } catch (err) {
                    console.error("LoginPage || refresh token error", err);
                }
            }
        }
        checkAuth();
    }, []);
    console.log("LoginPage || redirectPathCHeck Login", queryParams, queryParams.get("redirectTo"), queryParams.toString())
    useEffect(() => {
        if (actionData && actionData.tokenData) {
            console.log("LoginPage || Inside usesubmit")
            const { tokenData } = actionData;
            
            console.log("LoginPage || REDIRECT_URL", REDIRECT_URL)
            navigate(`${REDIRECT_URL}?redirectTo=${queryParams.get("redirectTo")}`, { state: {tokenData:tokenData}, replace: true });
        }
      }, [actionData, navigate]);
      
    const loginButtonText =
        navigation.state === "loading"
        ? "Logged-in!"
        : "Login";
    const labelCSS = 'block mb-2.5 text-[#333] text-lg font-bold'
    const inputCSS = 'w-full min-w-80 p-2.5 rounded-3xl border-none text-sm font-inherit bg-[#3B3B3B] text-gray-300 shadow-[0_0_10px_rgba(0,0,0,0.1)]'
    const buttonCSS = 'py-2.5 rounded cursor-pointer text-base font-inherit'
    const linkLabelCSS = 'text-sm'
    const labelErrorCSS = 'w-80 pl-2.5 pb-3.5 break-words hyphens-auto text-red-500'

  return (
    <>
    
    
    <div className="flex justify-center items-center flex-grow h-full w-full">
        <Login>
        <Render>
            {({ fields, buttons, blocks, $$index }) => {
            return (
                <div >
                    <Form method="post" id="login-form" className='flex flex-col gap-4'>
                        <header className='p-5 text-center text-2xl font-bold'>
                            {blocks.title}
                        </header>
                        <div >
                            <label className={labelCSS}>{fields.email}</label>
                        </div>
                        <div >
                            <label className={labelCSS}>{fields.password}</label>
                        </div>
                        <div className={linkLabelCSS}>
                            <Link to={`/signup`}>
                                Don't have an account? Sign in
                            </Link>
                        </div>
                        {actionData && actionData.error && <div className={labelErrorCSS}>{actionData.error}</div>}
                        <div >
                            {buttons.submit}
                        </div>
                    </Form>
                </div>
            );
            }}
        </Render>
        <Login.Block keyname="title" tagName="span">
            Login
        </Login.Block>
        <Login.Input className={inputCSS} name="email" keyname="email" placeholder="Please enter Email" defaultValue={actionData?.loginData?.email} />
        <Login.Input className={inputCSS} name="password" keyname="password" placeholder="Please enter password" type="password" defaultValue={actionData?.loginData?.password} />
        <Login.Button className={buttonCSS} keyname="submit" type="submit" disabled={navigation.state === "submitting"}>
            {navigation.state === "submitting" 
            ? <SpinnerDotted size={30} thickness={100} speed={100} color="rgba(57, 143, 172, 1)" /> 
             : loginButtonText}
        </Login.Button>
        </Login>
    </div>
    </>
  );
};
export default LoginPage;