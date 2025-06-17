
import { useEffect, useState } from 'react';
import { LoginSection } from '@/components/LoginSection';
import { Dashboard } from '@/components/Dashboard';
import { Loader } from '@/components/Loader';
import { ErrorBox } from '@/components/ErrorBox';
import { useAppSharing } from '@/contexts/AppContext';
import { getGoogleProfile } from '@/lib/api';

const Index = () => {
  const { profileData, baseUrl, setProfileData, errorMsg, setErrorMsg, isLoading, setIsLoading } = useAppSharing();

  useEffect(() => {
    getGoogleProfile(baseUrl, setProfileData, setIsLoading);
    console.log("\x1b[31m\x1b[1m%s\x1b[0m", "⚠️  WARNING: Read the README file!");
  }, [baseUrl, setProfileData, setIsLoading]);

  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => {
        setErrorMsg(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg, setErrorMsg]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {profileData ? <Dashboard /> : <LoginSection />}
      
      {isLoading && <Loader />}
      
      {errorMsg && <ErrorBox message={errorMsg} />}
    </div>
  );
};

export default Index;
