import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import './App.css'
import BudgetPage, {loader as budgetLoader, action as addBudgetAction} from "./routes/Budget/BudgetPage";
import AddBudgetPage, {loader as addBudgetLoader} from "./routes/Budget/AddBudgetPage";
import HomePage from "./routes/Home"
import Header from "./routes/Header";
import ErrorPage from "./error-page";

function App() { 

  const router = createBrowserRouter(
      createRoutesFromElements(
        <Route path="/" element={<Header />}  errorElement={<ErrorPage />} >
          <Route index path="/" element={<HomePage /> } errorElement={<ErrorPage />} />
          <Route path="budget" element={<BudgetPage />} loader={budgetLoader} errorElement={<ErrorPage />} action={addBudgetAction}>
            <Route path="add" element={<AddBudgetPage />} loader={addBudgetLoader} errorElement={<ErrorPage />}/>
          </Route>          
      </Route>
      )
  );
  return (<RouterProvider router={router} />)
}

export default App
