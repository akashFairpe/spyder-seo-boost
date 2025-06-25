
import { useState } from 'react';
import { Plus, Globe, TrendingUp, BarChart3, Lightbulb, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppSharing } from '@/contexts/AppContext';
import { getGoogleData, consoleReport } from '@/lib/api';
import { DataPresentation } from './DataPresentation';
import { SeoStrategy } from './SeoStrategy';

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

  const [activeSection, setActiveSection] = useState<'dashboard' | 'optimization' | 'strategy'>('dashboard');

  const fetchGoogleData = () => {
    getGoogleData(baseUrl, setWebsiteList, setIsLoading, setShowMessage);
  };

  const getReport = (siteUrl: string) => {
    consoleReport(baseUrl, siteUrl, setReportData, setIsLoading, siteUrl);
    setSelectedDomain(siteUrl);
  };

  if (activeSection === 'strategy') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setActiveSection('dashboard')}
            className="p-2"
          >
            ← Back to Dashboard
          </Button>
          <h1 className="text-xl font-bold text-gray-900">SEO Strategy Research</h1>
        </div>
        <SeoStrategy baseUrl={baseUrl} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Connect Google Services - Compact */}
      <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">Connect Google Services</h3>
                <p className="text-sm text-blue-700">Analytics & Search Console access</p>
              </div>
            </div>
            <Button 
              onClick={fetchGoogleData}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Connect
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Action Buttons */}
      <Card className="mb-6 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-orange-900 mb-2">SEO Tools</h3>
              <p className="text-sm text-orange-700">Choose your optimization approach</p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={() => setActiveSection('optimization')}
                className="bg-orange-600 hover:bg-orange-700 flex items-center gap-2"
              >
                <Lightbulb className="w-4 h-4" />
                WordPress Optimization
              </Button>
              <Button 
                onClick={() => setActiveSection('strategy')}
                variant="outline"
                className="border-orange-300 text-orange-700 hover:bg-orange-50 flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                SEO Strategy
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Website List - Compact */}
      {websiteList.length > 0 && (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Your Websites</CardTitle>
            <CardDescription className="text-sm">
              Click any website to analyze its SEO data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {websiteList.map((site, index) => (
                <Button
                  key={index}
                  onClick={() => getReport(site.siteUrl)}
                  variant={selectedDomain === site.siteUrl ? "default" : "outline"}
                  className="flex items-center gap-2 text-sm"
                  size="sm"
                >
                  <Globe className="w-3 h-3" />
                  {site.siteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {site.permissionLevel}
                  </Badge>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Message Display - Compact */}
      {showMessage && showMessage.status && (
        <Card className="mb-6 bg-yellow-50 border-yellow-200">
          <CardContent className="pt-4 pb-4">
            <div className="text-center text-sm text-yellow-800">
              {showMessage.message}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Presentation */}
      {reportData && reportData.length > 0 && activeSection === 'dashboard' && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="w-4 h-4" />
              SEO Performance
              {selectedDomain && (
                <Badge variant="outline" className="ml-2 text-xs">
                  {selectedDomain.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="text-sm">
              Click "Optimize" on any page for AI-powered recommendations
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
