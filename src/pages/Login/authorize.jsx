import {
    useLocation,
    useNavigate,
    useParams,
    useSearchParams,
  } from "react-router-dom";
import { useAuth } from "../../hooks/AuthProvider";
import { useEffect } from "react";
import { SpinnerCircularSplit } from "spinners-react";
  


  export default function Authorize() {
    console.log("Authorize || calling Authorize")
    const location = useLocation();
    const { setAuthenticateUser } = useAuth();
    const [queryParams] = useSearchParams();
    const navigate = useNavigate();
    const redirectUrl = queryParams.get("redirectTo");
    console.log("Authorize || queryParams", queryParams, queryParams.get("redirectTo"), queryParams.toString())
    console.log("Authorize || location", location)
    const prevState = location.state;
    const prevlocation = prevState?.redirectFrom;
    const tokenData = prevState?.tokenData;
    // const handleAuthorization = async () => {
    //     console.log("calling hanlde login")
    //     await setAuthenticateUser(prevState)        
    // };
    console.log("Authorize || redirectPathCHeck Authorize", location, location.pathname, location.state, prevlocation?.pathname)
    console.log("Authorize || state", redirectUrl);
    useEffect(() => {
      if (tokenData) {
        setAuthenticateUser(tokenData)      
        navigate(redirectUrl, {replace: true})
      }
    }, []);
    return (
      <>
        {tokenData ? 
        <div>
           <SpinnerCircularSplit size={50} thickness={100} speed={100} color="#36ad47" secondaryColor="rgba(0, 0, 0, 0.44)" />
        </div>
            : <></>
        }
      </>
    );
  }