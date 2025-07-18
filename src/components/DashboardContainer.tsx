
import { useState } from 'react';
import { Plus, Globe, TrendingUp, BarChart3, Lightbulb, Search, FileSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppSharing } from '@/contexts/AppContext';
import { getGoogleData, consoleReport } from '@/lib/api';
import { DataPresentation } from './DataPresentation';
import { SeoStrategy } from './SeoStrategy';
import { SeoAudit } from './SeoAudit';

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

  const [activeSection, setActiveSection] = useState<'dashboard' | 'optimization' | 'strategy' | 'audit'>('dashboard');

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

  if (activeSection === 'audit') {
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
          <h1 className="text-xl font-bold text-gray-900">SEO Audit</h1>
        </div>
        <SeoAudit baseUrl={baseUrl} />
      </div>
    );
  }

  if (activeSection === 'optimization') {
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
          <h1 className="text-xl font-bold text-gray-900">WordPress Optimization</h1>
        </div>

        {/* Connect Google Services */}
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

        {/* Website List */}
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

        {/* Message Display */}
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
        {reportData && reportData.length > 0 && (
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
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* SEO Tools Menu */}
      <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl text-blue-900">SEO Tools</CardTitle>
          <CardDescription className="text-blue-700">
            Choose your optimization approach and start improving your website's SEO
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* WordPress Optimization */}
            <Card className="bg-white border-orange-200 hover:shadow-md transition-shadow cursor-pointer" 
                  onClick={() => setActiveSection('optimization')}>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">WordPress Optimization</h3>
                  <p className="text-sm text-gray-600">
                    Connect Google Search Console and optimize your WordPress pages
                  </p>
                  <Button 
                    className="bg-orange-600 hover:bg-orange-700 w-full"
                    size="sm"
                  >
                    Get Started
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* SEO Strategy */}
            <Card className="bg-white border-green-200 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setActiveSection('strategy')}>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Search className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">SEO Strategy</h3>
                  <p className="text-sm text-gray-600">
                    Research keywords and develop content strategies for your niche
                  </p>
                  <Button 
                    variant="outline"
                    className="border-green-300 text-green-700 hover:bg-green-50 w-full"
                    size="sm"
                  >
                    Start Research
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* SEO Audit */}
            <Card className="bg-white border-purple-200 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setActiveSection('audit')}>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FileSearch className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">SEO Audit</h3>
                  <p className="text-sm text-gray-600">
                    Comprehensive analysis of your website's SEO performance
                  </p>
                  <Button 
                    variant="outline"
                    className="border-purple-300 text-purple-700 hover:bg-purple-50 w-full"
                    size="sm"
                  >
                    Start Audit
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
