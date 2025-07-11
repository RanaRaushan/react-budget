import { useEffect } from 'react';
import Login, { Render } from 'react-login-page';
import './login.css';
import {
  Form,
  Link,
  useActionData,
  useNavigate,
  useNavigation,
  useSearchParams,
} from 'react-router-dom';
import { auth_get_token, refresh_token } from '../../utils/APIHelper';
import { SpinnerDotted } from 'spinners-react';
import { useAuth } from '../../hooks/AuthProvider';
import { isTokenExpired } from '../../utils/ValidateToken';

let REDIRECT_URL = '/auth/callback';

export async function action({ request }) {
  const loginFormData = await request.formData();
  const loginData = Object.fromEntries(loginFormData);
  let response;
  let error;
  if (loginData && loginData.email && loginData.password) {
    response = await auth_get_token({
      email: loginData.email,
      password: loginData.password,
    });
  } else {
    return { loginData: loginData, error: 'Please enter data to login' };
  }
  if (response && response.event && response.event.startsWith('Error')) {
    error = response.message;
    return { loginData: loginData, error: error };
  }
  if (!response) {
    return {
      loginData: loginData,
      error: 'Something went wrong! Please try again after some time...',
    };
  }
  const expireAt = new Date().getTime() + Number(response.expires_in);
  return {
    loginData: loginData,
    tokenData: { body: response, expireAt: expireAt, user: loginData.email },
  };
}

const LoginPage = () => {
  const navigation = useNavigation();
  const actionData = useActionData();
  const navigate = useNavigate();
  const [queryParams] = useSearchParams();
  const auth = useAuth();
  useEffect(() => {
    const checkAuth = async () => {
      if (auth && auth.token && !isTokenExpired(auth.token)) {
        // Redirect to login or home page
        navigate('/', { replace: true });
      } else if (
        auth &&
        auth.token &&
        auth.token.body &&
        isTokenExpired(auth.token) &&
        auth.token.body.refreshToken
      ) {
        try {
          const res = await refresh_token({
            refreshToken: auth.token?.body?.refreshToken,
          });
          if (res?.token) {
            const expireAt = new Date().getTime() + Number(res?.expires_in);
            const tokenData = res && {
              body: res,
              expireAt: expireAt,
              user: auth.token?.user,
            };
            auth.removeToken();
            res &&
              navigate(
                `${REDIRECT_URL}?redirectTo=${queryParams.get('redirectTo')}`,
                { state: { tokenData: tokenData }, replace: true },
              );
        //   }
          }
        } catch (err) {
          console.error('LoginPage || refresh token error', err);
        }
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (actionData && actionData.tokenData) {
      const { tokenData } = actionData;

      navigate(`${REDIRECT_URL}?redirectTo=${queryParams.get('redirectTo')}`, {
        state: { tokenData: tokenData },
        replace: true,
      });
    }
  }, [actionData, navigate]);

  const loginButtonText =
    navigation.state === 'loading' ? 'Logged-in!' : 'Login';
  const labelCSS = 'block mb-2.5 text-[#333] text-[1.125em] font-bold';
  const inputCSS =
    'w-full min-w-80 p-2.5 rounded-3xl border-none text-[0.875em] font-inherit bg-[#3B3B3B] text-gray-300 shadow-[0_0_10px_rgba(0,0,0,0.1)]';
  const buttonCSS = 'py-2.5 rounded cursor-pointer font-inherit';
  const linkLabelCSS = 'text-[0.875em]';
  const labelErrorCSS = 'w-80 pl-2.5 pb-3.5 break-words text-red-500';

  return (
    <>
      <div className="flex justify-center items-center flex-grow h-full w-full">
        <Login>
          <Render>
            {({ fields, buttons, blocks, $$index }) => {
              return (
                <div>
                  <Form
                    method="post"
                    id="login-form"
                    className="flex flex-col gap-4"
                  >
                    <header className="p-5 text-center text-[1.5em] font-bold">
                      {blocks.title}
                    </header>
                    <div>
                      <label className={labelCSS}>{fields.email}</label>
                    </div>
                    <div>
                      <label className={labelCSS}>{fields.password}</label>
                    </div>
                    <div className={linkLabelCSS}>
                      <Link to={`/signup`}>Don't have an account? Sign in</Link>
                    </div>
                    {actionData && actionData.error && (
                      <div className={labelErrorCSS}>{actionData.error}</div>
                    )}
                    <div>{buttons.submit}</div>
                  </Form>
                </div>
              );
            }}
          </Render>
          <Login.Block keyname="title" tagName="span">
            Login
          </Login.Block>
          <Login.Input
            className={inputCSS}
            name="email"
            keyname="email"
            placeholder="Please enter Email"
            defaultValue={actionData?.loginData?.email}
          />
          <Login.Input
            className={inputCSS}
            name="password"
            keyname="password"
            placeholder="Please enter password"
            type="password"
            defaultValue={actionData?.loginData?.password}
          />
          <Login.Button
            className={buttonCSS}
            keyname="submit"
            type="submit"
            disabled={navigation.state === 'submitting'}
          >
            {navigation.state === 'submitting' ? (
              <SpinnerDotted
                size={30}
                thickness={100}
                speed={100}
                color="rgba(57, 143, 172, 1)"
              />
            ) : (
              loginButtonText
            )}
          </Login.Button>
        </Login>
      </div>
    </>
  );
};
export default LoginPage;
