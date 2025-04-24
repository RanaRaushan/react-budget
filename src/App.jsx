import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import './App.css'
import BudgetPage, {loader as budgetLoader, action as addBudgetAction} from "./routes/Budget/BudgetPage";
import AddBudgetItem from "./routes/Budget/AddBudgetPage";
import UpdateBudgetItem from "./routes/Budget/UpdateBudgetPage";
import HomePage from "./routes/Home"
import Header from "./routes/Header";
import ErrorPage from "./error-page";

function App() { 

  const router = createBrowserRouter(
      createRoutesFromElements(
        <Route path="/" element={<Header />}  errorElement={<ErrorPage />} >
          <Route index path="/" element={<HomePage /> } errorElement={<ErrorPage />} />
          <Route path="budget" element={<BudgetPage />} loader={budgetLoader} errorElement={<ErrorPage />} action={addBudgetAction}>
            <Route path="add" element={<AddBudgetItem />} errorElement={<ErrorPage />}/>
            {/* <Route path="update" element={<UpdateBudgetItem />} errorElement={<ErrorPage />}/> */}
          </Route>          
      </Route>
      )
  );
  return (<RouterProvider router={router} />)
}

export default App
