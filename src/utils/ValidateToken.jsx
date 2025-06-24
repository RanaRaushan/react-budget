export const isTokenExpired = (tokenData) => {
    const currentTime = new Date().getTime();
    const expiryTime = tokenData?.expireAt;
    if (currentTime > expiryTime) {
      console.log("validateToken || Token expired")
      return true;
    }
    return !(tokenData && tokenData?.body?.token 
            && tokenData?.expireAt);
  }