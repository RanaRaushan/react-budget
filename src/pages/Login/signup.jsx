import React, { useState } from 'react';
import Login, { Render } from 'react-login-page';
import './login.css';
import { Form, Link, redirect, useActionData, useNavigation, useSubmit } from 'react-router-dom';
import { register_user } from '../../utils/APIHelper';
import { SpinnerDotted } from 'spinners-react';

export async function action({ request }) {
    const registerFormData = await request.formData();
    const registerData = Object.fromEntries(registerFormData);
    let response;
    let error;
    if (registerData && registerData.email && registerData.password){
        response = await register_user(registerData)
    }
    else {
        return {registerData:registerData, error: "Please enter data to Register"};
    }
    if (response && response.event === "Error") {
        error = response.message
        return {registerData:registerData, error: error};
    }
    if (!response) {
        return {registerData:registerData, error: "Something went wrong! Please try again after some time..."};
    }
    return redirect("/login")
  }

const SingupPage = () => {
    const [errors, setErrors] = useState({});
    const actionData = useActionData();
    const navigation = useNavigation();
    
    const validateInput = (value, keyName) => {
        const validationError = {};
        if (!value) {
            validationError[keyName] ='Required'
        } else {
            delete errors[keyName];
        }
        
        if (keyName === 'email') {
            if (!/^[^@]+@[^]+\.[^]+$/.test(value)) {
                validationError[keyName] = 'Invalid email address';
            } else {
                delete errors[keyName];
            }
        }
        if (keyName === 'password') {
            const {error, valid} = passwordValidator(value)
            if (valid){
                validationError[keyName] = error;
            } else {
                delete errors[keyName];
            }
        }
        setErrors({...errors, ...validationError});
        return validationError;
    }

    const passwordValidator = (password) => {
        const errorList = [];
        if (password.length < 8) {
            errorList.push('<li>Password must be at least 8 characters long</li>');
        }
        if (!/[A-Z]/.test(password)) {
            errorList.push('<li>Password must contain at least one uppercase letter</li>');
        }
        if (!/[a-z]/.test(password)) {
            errorList.push('<li>Password must contain at least one lowercase letter</li>');
        }
        if (!/[0-9]/.test(password)) {
            errorList.push('<li>Password must contain at least one number</li>');
        }
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            errorList.push('<li>Password must contain at least one special character</li>');
        }
        
        const htmlString = "<ul>" + errorList.join("<br>") + "</ul>"
        const errorHtmlObj = errorList.length ? {__html:htmlString} : {__html:""}
        const containError = errorList.length ? true : false
        setErrors({...errors, ...errorList});
        return {error:errorHtmlObj, valid:containError};
    };

    
    
    const signupButtonText =
        navigation.state === "loading"
        ? "Signed-in!"
        : "Signup";

    const labelCSS = 'block mb-2.5 text-[#333] text-lg font-bold'
    const inputCSS = 'w-full min-w-80 p-2.5 rounded-3xl border-none text-sm font-inherit bg-[#3B3B3B] text-gray-300 shadow-[0_0_10px_rgba(0,0,0,0.1)]'
    const buttonCSS = 'py-2.5 rounded cursor-pointer text-base font-inherit'
    const linkLabelCSS = 'text-sm'
    const labelErrorCSS = 'w-80 pl-2.5 pb-3.5 break-words hyphens-auto text-red-500'

    return (
    <div className="flex justify-center items-center flex-grow h-full w-full">
        <Login>
        <Render>
            {({ fields, buttons, blocks, $$index }) => {
            return (
                <div >
                    <Form method="post" id="signup-form" className='flex flex-col gap-4' >
                        <header className='p-5 text-center text-2xl font-bold'>
                            {blocks.title}
                        </header>
                        <div>
                            <label className={labelCSS}>{fields.firstName}</label>
                            {errors.fname && <div className={labelErrorCSS}>{errors.fname}</div>}
                        </div>
                        <div>
                            <label className={labelCSS}>{fields.lastName}</label>
                            {errors.lname && <div className={labelErrorCSS}>{errors.lname}</div>}
                        </div>
                        <div>
                            <label className={labelCSS}>{fields.email}</label>
                            {errors.email && <div className={labelErrorCSS}>{errors.email}</div>}
                        </div>
                        <div>
                            <label className={labelCSS}>{fields.password}</label>
                            {errors.password && <div className={labelErrorCSS}><div dangerouslySetInnerHTML={errors.password} /></div>}
                        </div>
                        <div className={linkLabelCSS}>
                            <Link to={`/login`}>
                                Already have an account? Sign in
                            </Link>
                        </div>
                        {actionData && actionData.error && <div className={labelErrorCSS}>{actionData.error}</div>}
                        <div className= {`${buttonCSS} ${errors ? "disabled" : ""}`}>
                            {buttons.submit}
                        </div>
                    </Form>
                </div>
            );
            }}
        </Render>
        <Login.Block keyname="title" tagName="span">
            Singup
        </Login.Block>
        <Login.Input className={inputCSS} name="firstName" keyname="firstName" placeholder="Please enter First Name" onChange={(e) => validateInput(e.target.value, "firstName") }/>
        <Login.Input className={inputCSS} name="lastName" keyname="lastName" placeholder="Please enter Last Name" onChange={(e) => validateInput(e.target.value, "lastName") }/>
        <Login.Input className={inputCSS} name="email" keyname="email" placeholder="Please enter Email" onChange={(e) => validateInput(e.target.value, "email") }/>
        <Login.Input className={inputCSS} name="password" keyname="password" placeholder="Please enter Password" type="password" onChange={(e) => validateInput(e.target.value, "password") }/>
        <Login.Button className={buttonCSS} keyname="submit" type="submit" disabled={errors && Object.keys(errors).length ? 'disabled' : ''} >
        {navigation.state === "submitting" 
            ? <SpinnerDotted size={30} thickness={100} speed={100} color="rgba(57, 143, 172, 1)" /> 
             : signupButtonText}
        </Login.Button>
        </Login>
    </div>
    
  );
};
export default SingupPage;