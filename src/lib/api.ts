
const googleAuth = (authUrl: string) => {
  const popup = window.open(
    authUrl,
    'google-auth',
    'width=500,height=600,scrollbars=yes,resizable=yes'
  );
  
  const checkClosed = setInterval(() => {
    if (popup?.closed) {
      clearInterval(checkClosed);
    }
  }, 1000);
};

export const getGoogleProfile = (
  baseUrl: string, 
  setProfileData: (data: any) => void, 
  setIsLoading: (loading: boolean) => void
) => {
  setIsLoading(true);
  fetch(`${baseUrl}/api/profile`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(response => response.json())
  .then(res => {
    setIsLoading(false);
    if (res.authUrl) {
      googleAuth(res.authUrl);
    }
    if (res.user) {
      const obj = {
        name: res.user.name,
        picture: res.user.picture
      };
      setProfileData(obj);
    }
  })
  .catch(error => {
    setIsLoading(false);
    console.error('Profile fetch error:', error);
  });
};

export const login = (baseUrl: string, setIsLoading: (loading: boolean) => void) => {
  setIsLoading(true);
  fetch(`${baseUrl}/api/auth/v1`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then((r) => r.json())
  .then((res) => {
    setIsLoading(false);
    if (res.authUrl) {
      googleAuth(res.authUrl);
    }
  })
  .catch(error => {
    setIsLoading(false);
    console.error('Login error:', error);
  });
};

export const advanceLogin = (baseUrl: string, setIsLoading: (loading: boolean) => void) => {
  setIsLoading(true);
  fetch(`${baseUrl}/api/auth/v2`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then((r) => r.json())
  .then((res) => {
    setIsLoading(false);
    if (res.authUrl) {
      googleAuth(res.authUrl);
    }
  })
  .catch(error => {
    setIsLoading(false);
    console.error('Advanced login error:', error);
  });
};
