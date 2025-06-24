import {
    useLocation,
    useNavigate,
    useParams,
    useSearchParams,
  } from "react-router-dom";
import { useAuth } from "../../hooks/AuthProvider";
import { useEffect, useState } from "react";
import { SpinnerCircularSplit } from "spinners-react";
  


  export default function Authorize() {
    console.log("Authorize || calling Authorize")
    const location = useLocation();
    const { setAuthenticateUser } = useAuth();
    const [queryParams] = useSearchParams();
    const navigate = useNavigate();
    const [isReady, setIsReady] = useState(false);
    const redirectUrl = queryParams.get("redirectTo");
    // console.log("Authorize || queryParams", queryParams, queryParams.get("redirectTo"), queryParams.toString())
    const prevState = location.state;
    const tokenData = prevState?.tokenData;
    // console.log("Authorize || location & token", location, tokenData)
    // console.log("Authorize || redirectUrl", redirectUrl);

    useEffect(() => {
      if (tokenData) {
        setAuthenticateUser(tokenData)      
        setIsReady(true);
      }
    }, [tokenData]);

    useEffect(() => {
    if (isReady) {
      navigate(redirectUrl, { replace: true });
    }
  }, [isReady, navigate, redirectUrl]);
    return (
      <>
        <div className="Rana check">
           <SpinnerCircularSplit size={50} thickness={100} speed={100} color="#36ad47" secondaryColor="rgba(0, 0, 0, 0.44)" />
        </div>
      </>
    );
  }