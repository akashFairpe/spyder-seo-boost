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

export const getWordPressPage = (
  baseUrl: string, 
  wpUrl: string, 
  setCurrentReport: (data: any) => void, 
  selectedDomain: string, 
  setIsAuthenticated: (auth: boolean) => void, 
  setNoContent: (noContent: boolean) => void, 
  setIsLoading: (loading: boolean) => void, 
  id: string
) => {
  setIsLoading(true);
  fetch(`${baseUrl}/api/wordpress/getwebpage`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ wpUrl, selectedDomain }),
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(response => response.json())
  .then(res => {
    setIsLoading(false);
    if (res.data) {
      setCurrentReport(res.data);
      setIsAuthenticated(true);
      setNoContent(false);
      PageDataUrl(baseUrl, res.data, id);
    } else if (res.wordpressCredential) {
      setIsAuthenticated(false);
      setNoContent(false);
    } else {
      setNoContent(true);
    }
  })
  .catch(error => {
    setIsLoading(false);
    console.error('WordPress page fetch error:', error);
  });
};

const PageDataUrl = (baseUrl: string, data: any, id: string) => {
  fetch(`${baseUrl}/api/get-pre-signed-url`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ id }),
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(response => response.json())
  .then(res => {
    const pageData = data?.content?.rendered;
    const { fileUrl } = res;
    
    // Extract text content from HTML
    const element = document.createElement('div');
    element.innerHTML = pageData;
    const textContent = element.innerText || element.textContent;
    
    // Convert text to a Blob
    const textBlob = new Blob([textContent], { type: 'text/plain' });
    
    if (fileUrl) {
      uploadTxtToPresignedUrl(fileUrl, textBlob);
    }
  })
  .catch(error => console.error("Error fetching pre-signed URL:", error));
};

const uploadTxtToPresignedUrl = async (presignedUrl: string, textBlob: Blob) => {
  try {
    const response = await fetch(presignedUrl, {
      method: "PUT",
      body: textBlob,
      headers: {
        'Content-Type': 'text/plain',
      }
    });
    
    if (response.ok) {
      console.log("TXT file uploaded successfully");
    } else {
      console.error("Failed to upload TXT file:", response.statusText);
    }
  } catch (error) {
    console.error("Error uploading TXT file:", error);
  }
};

export const wordpressLogin = (
  baseUrl: string, 
  wName: string, 
  wPassword: string, 
  selectedDomain: string, 
  setWplogged: (logged: boolean) => void
) => {
  fetch(`${baseUrl}/api/wordpress/login`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ wName, wPassword, selectedDomain }),
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(response => response.json())
  .then(res => {
    if (res.state) {
      setWplogged(true);
    }
  })
  .catch(err => {
    console.log("WordPress login error", err);
  });
};

export const getPromptData = async (baseUrl: string, selectedDomain: string, link: string, id: string, prompt: string) => {
  try {
    const response = await fetch(`${baseUrl}/api/get-prompt`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ 
        websiteUrl: selectedDomain, 
        websitePageUrl: link, 
        prompt: prompt, 
        id: id 
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const res = await response.json();
    
    // Return the actual content string instead of the full response object
    // Adjust this based on your API response structure
    return res.content || res.data || res.result || res;
  } catch (err) {
    console.error("Error fetching prompt data:", err);
    return null;
  }
};
