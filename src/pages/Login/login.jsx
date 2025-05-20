import React, { useEffect, useState } from 'react';
import Login, { Render } from 'react-login-page';
import './login.css';
import { Form, Link, useActionData, useLocation, useNavigate, useNavigation } from 'react-router-dom';
import {auth_get_token} from '../../utils/APIHelper';
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
    const location = useLocation();
    const auth = useAuth();
    const prevState = location.state;
    const prevlocation = prevState?.redirectFrom;
    // console.log("actionData", actionData, location)
    useEffect(() => {
        if (auth && auth.token && validateToken(auth.token)) {
        // Redirect to login or home page
            console.log("LoginPage || valid token found", auth)
            navigate('/', { replace: true });
        } else if (auth && auth.token && !validateToken(auth.token)) {
            console.log("LoginPage || token expired or invalid", auth)
            auth.removeToken();
        }
    }, []);
    console.log("LoginPage || redirectPathCHeck Login", location, location.pathname)
    useEffect(() => {
        if (actionData && actionData.tokenData) {
            console.log("LoginPage || Inside usesubmit")
            const { tokenData } = actionData;
            
            console.log("LoginPage || REDIRECT_URL", REDIRECT_URL)
            navigate(REDIRECT_URL, { state: {redirectFrom:prevlocation, tokenData:tokenData}, replace: true });
        }
      }, [actionData, navigate]);
      
    const loginButtonText =
        navigation.state === "loading"
        ? "Logged-in!"
        : "Login";
  return (
    <>
    
    
    <div className="login-body">
        <Login>
        <Render>
            {({ fields, buttons, blocks, $$index }) => {
            return (
                <div >
                    <Form method="post" id="login-form" >
                        <header className='login-header'>
                            {blocks.title}
                        </header>
                        <div className='label-input-container input-margin-btm'>
                            <label>{fields.email}</label>
                        </div>
                        <div className='label-input-container'>
                            <label>{fields.password}</label>
                        </div>
                        <div className='link-label'>
                            <Link to={`/signup`}>
                                Don't have an account? Sign in
                            </Link>
                        </div>
                        {actionData && actionData.error && <div className='singup-label-error'>{actionData.error}</div>}
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
        <Login.Input name="email" keyname="email" placeholder="Please enter Email" defaultValue={actionData?.loginData?.email} />
        <Login.Input name="password" keyname="password" placeholder="Please enter password" type="password" defaultValue={actionData?.loginData?.password} />
        <Login.Button keyname="submit" type="submit" disabled={navigation.state === "submitting"}>
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