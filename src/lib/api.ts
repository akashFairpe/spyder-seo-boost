
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

export const getGoogleData = (
  baseUrl: string, 
  setWebsiteList: (sites: any[]) => void, 
  setIsLoading: (loading: boolean) => void, 
  setShowMessage: (message: { message: string; status: boolean }) => void
) => {
  setIsLoading(true);

  fetch(`${baseUrl}/api/googledata`, {
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
    } else if (res.sites) {
      setWebsiteList(res.sites);
      setShowMessage({
        message: "Click the button above to fetch your data.",
        status: false
      });
    } else {
      setShowMessage({
        message: "No data found",
        status: true
      });
    }
  })
  .catch(error => {
    setIsLoading(false);
    console.error('Google data fetch error:', error);
  });
};

export const consoleReport = (
  baseUrl: string, 
  selectedDomain: string, 
  setReportData: (data: any[]) => void, 
  setIsLoading: (loading: boolean) => void, 
  siteUrl: string
) => {
  setIsLoading(true);
  fetch(`${baseUrl}/api/consolereport`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ selectedDomain }),
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(response => response.json())
  .then(res => {
    setIsLoading(false);
    if (res.authUrl) {
      window.open(res.authUrl);
    }
    if (res.pages) {
      addAiPath(baseUrl, res.pages, siteUrl, setReportData);
    }
  })
  .catch(err => {
    console.log("error", err);
    setIsLoading(false);
  });
};

const addAiPath = (
  baseUrl: string, 
  data: any[], 
  siteUrl: string, 
  setReportData: (data: any[]) => void
) => {
  let urlList = data.map(item => item.pageUrl);

  fetch(`${baseUrl}/api/get-webpage-url`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({
      websiteUrl: siteUrl,
      webpageUrls: urlList
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(response => response.json())
  .then(res => {
    let webpageData = res.webpages;

    const webpageMap = new Map(webpageData.map((wp: any) => [wp.webpageUrl, wp.id]));
    const mergedData = data.map(item => ({
      ...item,
      id: webpageMap.get(item.pageUrl) || null
    }));

    setReportData(mergedData);
  })
  .catch(err => {
    setReportData(data);
  });
};
