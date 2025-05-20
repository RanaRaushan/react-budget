export const validateToken = (tokenData) => {
    const currentTime = new Date().getTime();
    const expiryTime = tokenData?.expireAt;
    if (currentTime > expiryTime) {
      console.log("APIHelper || Token expired")
      return false;
    }
    return tokenData && tokenData?.body?.token 
            && tokenData?.expireAt;
  }