
import { useState, useEffect } from 'react';
import { Plus, Globe, TrendingUp, BarChart3, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppSharing } from '@/contexts/AppContext';
import { GoogleConnectModal } from './GoogleConnectModal';

export const DashboardContainer = () => {
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [domains] = useState([
    {
      id: 1,
      domain: 'example.com',
      status: 'connected',
      pages: 156,
      clicks: 1844,
      impressions: 252053,
      ctr: 0.01,
      position: 37.29
    },
    {
      id: 2,
      domain: 'blog.example.com',
      status: 'connected',
      pages: 89,
      clicks: 892,
      impressions: 45620,
      ctr: 0.02,
      position: 24.5
    }
  ]);

  const { setSelectedDomain } = useAppSharing();

  const handleDomainClick = (domain: any) => {
    setSelectedDomain(domain.domain);
    // Navigate to domain details
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
              onClick={() => setShowConnectModal(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Connect Services
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Domains</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{domains.length}</div>
            <p className="text-xs text-muted-foreground">Connected websites</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {domains.reduce((sum, domain) => sum + domain.clicks, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Last 28 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impressions</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {domains.reduce((sum, domain) => sum + domain.impressions, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Search visibility</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Position</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(domains.reduce((sum, domain) => sum + domain.position, 0) / domains.length).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">Search ranking</p>
          </CardContent>
        </Card>
      </div>

      {/* Connected Domains */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Domains</CardTitle>
          <CardDescription>
            Your websites connected to Google Analytics and Search Console
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {domains.map((domain) => (
              <div
                key={domain.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleDomainClick(domain)}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{domain.domain}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {domain.status}
                      </Badge>
                      <span className="text-sm text-gray-500">{domain.pages} pages</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 text-sm">
                  <div className="text-center">
                    <div className="font-medium">{domain.clicks.toLocaleString()}</div>
                    <div className="text-gray-500">Clicks</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{domain.impressions.toLocaleString()}</div>
                    <div className="text-gray-500">Impressions</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{(domain.ctr * 100).toFixed(2)}%</div>
                    <div className="text-gray-500">CTR</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{domain.position}</div>
                    <div className="text-gray-500">Position</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <GoogleConnectModal 
        open={showConnectModal} 
        onOpenChange={setShowConnectModal} 
      />
    </div>
  );
};
