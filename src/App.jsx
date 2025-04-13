import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import './App.css'
import HomePage, {loader as budgetLoader} from "./routes/homePage";
import Header from "./routes/HeaderLayout";

function App() {
  console.log("Inside App")
  

  const router = createBrowserRouter(
      createRoutesFromElements(
        // <Route path="/" element={<HomePage />} loader={budgetLoader}>
        // </Route>
        <Route path="/" element={<Header />}>
        <Route index element={<HomePage />} loader={budgetLoader} />
        
      </Route>
      )
  );
  return (<RouterProvider router={router} />)
}

export default App
