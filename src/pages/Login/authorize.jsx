import {
    useLocation,
    useNavigate,
    useParams,
  } from "react-router-dom";
import { useAuth } from "../../hooks/AuthProvider";
import { useEffect } from "react";
import { SpinnerCircularSplit } from "spinners-react";
  


  export default function Authorize() {
    console.log("Authorize | calling Authorize")
    const location = useLocation();
    const { setAuthenticateUser } = useAuth();
    let params = useParams();
    const navigate = useNavigate();
    const redirectUrl = params.length ? "" : "/"
    console.log("useParams", params)
    console.log("location", location)
    const state = location.state;
    // const handleAuthorization = async () => {
    //     console.log("calling hanlde login")
    //     await setAuthenticateUser(state)        
    // };
    
    console.log("Authorize | state", state);
    useEffect(() => {
      if (state) {
        setAuthenticateUser(state)      
        navigate(redirectUrl, {state: state, replace: true})
      }
    }, []);
    return (
      <>
        {state ? 
        <div>
           <SpinnerCircularSplit size={50} thickness={100} speed={100} color="#36ad47" secondaryColor="rgba(0, 0, 0, 0.44)" />
        </div>
            : <></>
        }
      </>
    );
  }