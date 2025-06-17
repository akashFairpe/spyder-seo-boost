
import { useState } from 'react';
import { Plus, Globe, TrendingUp, BarChart3, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppSharing } from '@/contexts/AppContext';
import { getGoogleData, consoleReport } from '@/lib/api';
import { DataPresentation } from './DataPresentation';

export const DashboardContainer = () => {
  const { 
    baseUrl, 
    setReportData, 
    reportData, 
    selectedDomain, 
    setSelectedDomain, 
    setIsLoading,
    websiteList,
    setWebsiteList,
    showMessage,
    setShowMessage
  } = useAppSharing();

  const fetchGoogleData = () => {
    getGoogleData(baseUrl, setWebsiteList, setIsLoading, setShowMessage);
  };

  const getReport = (siteUrl: string) => {
    consoleReport(baseUrl, siteUrl, setReportData, setIsLoading, siteUrl);
    setSelectedDomain(siteUrl);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Monitor and optimize your website's SEO performance</p>
      </div>

      {/* Connect Google Services */}
      <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-blue-900">Connect Google Services</CardTitle>
              <CardDescription className="text-blue-700">
                Connect Google Analytics and Search Console for advanced permissions
              </CardDescription>
            </div>
            <Button 
              onClick={fetchGoogleData}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Connect Google Analytics and Search Console
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Website List */}
      {websiteList.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Connected Websites</CardTitle>
            <CardDescription>
              Click on any website to fetch its data from Google Search Console
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {websiteList.map((site, index) => (
                <Button
                  key={index}
                  onClick={() => getReport(site.siteUrl)}
                  variant={selectedDomain === site.siteUrl ? "default" : "outline"}
                  className="flex items-center gap-2"
                >
                  <Globe className="w-4 h-4" />
                  {site.siteUrl}
                  <Badge variant="secondary" className="ml-2">
                    {site.permissionLevel}
                  </Badge>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Message Display */}
      {showMessage && showMessage.status && (
        <Card className="mb-8 bg-yellow-50 border-yellow-200">
          <CardContent className="pt-6">
            <div className="text-center text-yellow-800">
              {showMessage.message}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Presentation */}
      {reportData && reportData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              SEO Performance Data
              {selectedDomain && (
                <Badge variant="outline" className="ml-2">
                  {selectedDomain}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Click "Optimize" on any page to get AI-powered SEO recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataPresentation />
          </CardContent>
        </Card>
      )}
    </div>
  );
};
