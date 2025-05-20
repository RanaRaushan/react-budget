import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Outlet,
  Route,
  RouterProvider,
} from "react-router-dom";
import './App.css'
import BudgetPage, {loader as budgetLoader, action as BudgetAction} from "./pages/Budget/BudgetPage";
import AddBudgetItemPage from "./pages/Budget/AddBudgetPage";
import HomePage from "./pages/Home"
import Header from "./pages/Header";
import ErrorPage from "./error-page";
import Uploadbudget, {action as UploadAction} from "./pages/Budget/Uploadbudget";
import LogoutPage from "./pages/Login/logout";
import LoginPage, {action as loginAction} from "./pages/Login/login";
import { RequireAuth } from "./components/RequireAuth";
import { AuthProvider, useAuth } from "./hooks/AuthProvider";
import SingupPage, { action as singupAction} from "./pages/Login/signup";
import Authorize from "./pages/Login/authorize";
import React from "react";

function App() { 

  const AuthProviderLayout = () => (
    <AuthProvider>
      <LogoutPage />
      <Outlet />
    </AuthProvider>
  );
  const auth = useAuth();
  console.log("auth at app", auth)
  const router = React.useMemo(() => {
  
  return createBrowserRouter(
      createRoutesFromElements(
        // <Route
        //   // element={<AuthProviderLayout /> } 
        //   errorElement={<ErrorPage />}
        //   >

              <Route path="/" element={<Header />}  errorElement={<ErrorPage />} >
                
                <Route index path="/" element={<HomePage /> } errorElement={<ErrorPage />} />
              <Route id="login" path="/login" element={<LoginPage />} action={loginAction} errorElement={<ErrorPage />} />
              <Route path="/auth/callback" element={<Authorize />} errorElement={<ErrorPage />} />
              
                <Route path="/signup" element={<SingupPage />} action={singupAction} errorElement={<ErrorPage />} />,

                <Route path="budget" element={<RequireAuth><BudgetPage /></RequireAuth>} loader={budgetLoader(auth)} errorElement={<ErrorPage />} action={BudgetAction}>
                  <Route path="add" element={<AddBudgetItemPage />} errorElement={<ErrorPage />} />
                </Route>     
                <Route index path="upload" element={<Uploadbudget />} errorElement={<ErrorPage />} action={UploadAction} />    
                <Route index path="*" element={<Navigate to="/" replace={true} />} />     
              </Route>
              
        // </Route>
      )
  );
  }, [auth]);
  return (<RouterProvider router={router} />)
}

export default App
