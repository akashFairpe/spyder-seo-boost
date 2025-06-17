
import React, { createContext, useContext, useState, ReactNode } from "react";

interface ProfileData {
  name: string;
  picture: string;
}

interface ReportData {
  id: string;
  title: string;
  data: any;
}

interface WebsiteData {
  siteUrl: string;
  permissionLevel: string;
}

interface PromptData {
  faqData: string;
  tableData: string;
  bulletData: string;
  tableContentData: string;
  numberListData: string;
  basedOnData: string;
  SingleData: string;
}

interface AppSharingContextType {
  baseUrl: string;
  setBaseUrl: (url: string) => void;
  profileData: ProfileData | null;
  setProfileData: (data: ProfileData | null) => void;
  reportData: ReportData[];
  setReportData: (data: ReportData[]) => void;
  selectedReport: ReportData | null;
  setSelectedReport: (report: ReportData | null) => void;
  currentReport: ReportData | null;
  setCurrentReport: (report: ReportData | null) => void;
  selectedDomain: string | null;
  setSelectedDomain: (domain: string | null) => void;
  websiteList: WebsiteData[];
  setWebsiteList: (sites: WebsiteData[]) => void;
  showMessage: { message: string; status: boolean } | null;
  setShowMessage: (message: { message: string; status: boolean } | null) => void;
  errorMsg: string | null;
  setErrorMsg: (msg: string | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  promptData: PromptData;
  setPromptData: (data: PromptData) => void;
}

const AppSharingContext = createContext<AppSharingContextType | undefined>(undefined);

interface AppSharingProviderProps {
  children: ReactNode;
}

export const AppSharingProvider = ({ children }: AppSharingProviderProps) => {
  const [baseUrl] = useState(import.meta.env.VITE_BASE_URL || "http://localhost:3000");
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
  const [currentReport, setCurrentReport] = useState<ReportData | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [websiteList, setWebsiteList] = useState<WebsiteData[]>([]);
  const [showMessage, setShowMessage] = useState<{ message: string; status: boolean } | null>({
    message: "Click the button above to fetch your data.",
    status: true
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [promptData, setPromptData] = useState<PromptData>({
    faqData: "",
    tableData: "",
    bulletData: "",
    tableContentData: "",
    numberListData: "",
    basedOnData: "",
    SingleData: ""
  });

  const contextValue: AppSharingContextType = {
    baseUrl,
    setBaseUrl: () => {}, // Read-only for now
    profileData,
    setProfileData,
    reportData,
    setReportData,
    selectedReport,
    setSelectedReport,
    currentReport,
    setCurrentReport,
    selectedDomain,
    setSelectedDomain,
    websiteList,
    setWebsiteList,
    showMessage,
    setShowMessage,
    errorMsg,
    setErrorMsg,
    isLoading,
    setIsLoading,
    promptData,
    setPromptData
  };

  return (
    <AppSharingContext.Provider value={contextValue}>
      {children}
    </AppSharingContext.Provider>
  );
};

export const useAppSharing = () => {
  const context = useContext(AppSharingContext);
  if (context === undefined) {
    throw new Error('useAppSharing must be used within an AppSharingProvider');
  }
  return context;
};
