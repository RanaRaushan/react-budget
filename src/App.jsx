import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";
import './App.css'
import BudgetPage, {loader as budgetLoader, action as BudgetAction} from "./routes/Budget/BudgetPage";
import AddBudgetItem from "./routes/Budget/AddBudgetPage";
import HomePage from "./routes/Home"
import Header from "./routes/Header";
import ErrorPage from "./error-page";
import Uploadbudget, {action as UploadAction} from "./routes/Budget/Uploadbudget";

function App() { 

  const router = createBrowserRouter(
      createRoutesFromElements(
        <Route path="/" element={<Header />}  errorElement={<ErrorPage />} >
          <Route index path="/" element={<HomePage /> } errorElement={<ErrorPage />} />
          <Route path="budget" element={<BudgetPage />} loader={budgetLoader} errorElement={<ErrorPage />} action={BudgetAction}>
            <Route path="add" element={<AddBudgetItem />} errorElement={<ErrorPage />} />
          </Route>     
          <Route index path="upload" element={<Uploadbudget />} errorElement={<ErrorPage />} action={UploadAction} />    
          <Route index path="*" element={<Navigate to="/" replace={true} />} />     
      </Route>
      )
  );
  return (<RouterProvider router={router} />)
}

export default App
