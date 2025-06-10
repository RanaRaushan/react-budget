import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";
import './App.css'
import BudgetPage, {loader as budgetLoader, action as budgetAction} from "./pages/Budget/BudgetPage";
import AddBudgetItemPage from "./pages/Budget/AddBudgetPage";
import HomePage from "./pages/Home"
import Header from "./pages/Header";
import ErrorPage from "./error-page";
import Uploadbudget, {action as uploadAction} from "./pages/Budget/Uploadbudget";
// import LogoutPage from "./components/LoginLogout";
import LoginPage, {action as loginAction} from "./pages/Login/login";
import { RequireAuth } from "./components/RequireAuth";
import { useAuth } from "./hooks/AuthProvider";
import SingupPage, { action as singupAction} from "./pages/Login/signup";
import Authorize from "./pages/Login/authorize";
import React from "react";
import ExpenseBudget, {loader as expenseLoader} from "./pages/Expenses/ExpensePage";
import BankBudget, {loader as bankLoader} from "./pages/Bank/BankPage";
import AddBudgetEntryPage from "./pages/Budget/AddBudgetEntryPage";
import InvestmentBudget, {loader as investmentLoader, action as investmentAction} from "./pages/Investment/InvestmentPage";
import AddInvestmentPage from "./pages/Investment/AddInvestmentpage";

function App() { 

  // const AuthProviderLayout = () => (
  //   <AuthProvider>
  //     <LogoutPage />
  //     <Outlet />
  //   </AuthProvider>
  // );
  const auth = useAuth();
  console.log("App || auth at app", auth)
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
                <Route path="auth/callback" element={<Authorize />} errorElement={<ErrorPage />} />
                <Route path="signup" element={<SingupPage />} action={singupAction} errorElement={<ErrorPage />} />,
                <Route path="budget" element={<RequireAuth><BudgetPage /></RequireAuth>} loader={budgetLoader(auth)} errorElement={<ErrorPage />} action={budgetAction}>
                  <Route path="add" element={<AddBudgetItemPage />} errorElement={<ErrorPage />} />
                  <Route path="entry/add/:entryId" element={<AddBudgetEntryPage />} errorElement={<ErrorPage />} />
                </Route>
                <Route index path="upload" element={<RequireAuth><Uploadbudget /></RequireAuth>} errorElement={<ErrorPage />} action={uploadAction} />    
                <Route index path="expenses/:type" element={<RequireAuth><ExpenseBudget /></RequireAuth>} errorElement={<ErrorPage />} loader={expenseLoader(auth)}/>    
                <Route index path="bank" element={<RequireAuth><BankBudget /></RequireAuth>} errorElement={<ErrorPage />} loader={bankLoader(auth)}/>    
                <Route path="investment" element={<RequireAuth><InvestmentBudget /></RequireAuth>} errorElement={<ErrorPage />} loader={investmentLoader(auth)} action={investmentAction}>
                  <Route path="add" element={<AddInvestmentPage />} errorElement={<ErrorPage />} />
                </Route>    
                <Route index path="*" element={<Navigate to="/" replace={true} />} />     
              </Route>
              
        // </Route>
      )
  );
  }, [auth]);
  return (<RouterProvider router={router} />)
}

export default App
