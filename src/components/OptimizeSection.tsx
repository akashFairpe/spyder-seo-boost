import { ArrowLeft, TrendingUp, Target, Lightbulb, User, Lock, AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppSharing } from '@/contexts/AppContext';
import { useEffect, useState } from 'react';
import { getWordPressPage, wordpressLogin } from '@/lib/api';
import FaqPrompt from './prompts/FaqPrompt';
import TablePrompt from './prompts/TablePrompt';
import BulletPrompt from './prompts/BulletPrompt';
import TableOfContentsPrompt from './prompts/TableOfContentsPrompt';
import NumberedListPrompt from './prompts/NumberedListPrompt';
import DataPrompt from './prompts/DataPrompt';
import SingleFocusedKeywordPrompt from './prompts/SingleFocusedKeywordPrompt';
import ImageGeneratorWithSelector from './prompts/ImageGeneratorWithSelector';

export const OptimizeSection = () => {
  const { 
    baseUrl,
    selectedReport, 
    setSelectedReport, 
    currentReport, 
    setCurrentReport,
    selectedDomain,
    setErrorMsg,
    setIsLoading,
    promptData,
    setPromptData
  } = useAppSharing();

  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [wName, setWName] = useState('');
  const [wPassword, setWPassword] = useState('');
  const [wplogged, setWplogged] = useState(false);
  const [noContent, setNoContent] = useState(false);
  const [gptId, setGptId] = useState('');

  // Optimization prompt states
  const [showfaqPrompt, setShowfaqPrompt] = useState(false);
  const [showTablePrompt, setShowTablePrompt] = useState(false);
  const [showBulletPrompt, setShowBulletPrompt] = useState(false);
  const [showTableOfContentsPrompt, setShowTableOfContentsPrompt] = useState(false);
  const [showNumberedListPrompt, setShowNumberedListPrompt] = useState(false);
  const [showDataPrompt, setShowDataPrompt] = useState(false);
  const [showSingleKey, setShowSingleKey] = useState(false);
  const [showImgGen, setShowImgGen] = useState(false);

  const initFn = () => {
    const wpUrl = selectedReport?.pageUrl;
    const id = selectedReport?.id;
    setGptId(id || '');
    if (wpUrl && selectedDomain) {
      getWordPressPage(baseUrl, wpUrl, setCurrentReport, selectedDomain, setIsAuthenticated, setNoContent, setIsLoading, id);
    }
  };

  useEffect(() => {
    initFn();
  }, []);

  useEffect(() => {
    if (wplogged) {
      initFn();
    }
  }, [wplogged]);

  const wLoginBtn = () => {
    if (!wName || !wPassword) {
      setErrorMsg('Please enter both username and password');
      return;
    }
    wordpressLogin(baseUrl, wName, wPassword, selectedDomain, setWplogged);
  };

  const handleClose = () => {
    setSelectedReport(null);
    setCurrentReport(null);
    setPromptData({
      faqData: "",
      tableData: "",
      bulletData: "",
      tableContentData: "",
      numberListData: "",
      basedOnData: "",
      SingleData: ""
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          onClick={handleClose}
          className="p-2"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">SEO Optimization</h1>
          <p className="text-sm text-gray-600">
            {selectedReport?.pageUrl && (
              <span className="truncate max-w-md inline-block">
                {selectedReport.pageUrl}
              </span>
            )}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="ml-auto text-red-600 hover:bg-red-50"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Content Display */}
      {currentReport && (
        <div className="space-y-6">
          {/* Page Content - Full height, no max-height restriction */}
          <Card>
            <CardHeader>
              <CardTitle>Page Content</CardTitle>
              <CardDescription>WordPress page content analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className="prose prose-sm max-w-none border rounded-lg p-4 bg-gray-50"
                dangerouslySetInnerHTML={{ __html: currentReport.content?.rendered || '' }}
              />
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Clicks</span>
                    <span>{selectedReport?.clicks || 0}</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Impressions</span>
                    <span>{selectedReport?.impressions || 0}</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>CTR</span>
                    <span>{selectedReport?.ctr?.toFixed(2) || '0.00'}%</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Position</span>
                    <span>{selectedReport?.position?.toFixed(1) || '0.0'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Optimization Options - Moved below content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-orange-600" />
                AI Optimization
              </CardTitle>
              <CardDescription>Choose optimization type</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setShowfaqPrompt(!showfaqPrompt)}
                >
                  Generate FAQ's
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setShowTablePrompt(!showTablePrompt)}
                >
                  Generate Tables
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setShowBulletPrompt(!showBulletPrompt)}
                >
                  Generate Bullet Points
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setShowTableOfContentsPrompt(!showTableOfContentsPrompt)}
                >
                  Table of Contents
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setShowNumberedListPrompt(!showNumberedListPrompt)}
                >
                  Numbered List
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setShowDataPrompt(!showDataPrompt)}
                >
                  Data-Based Content
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setShowSingleKey(!showSingleKey)}
                >
                  Single Keyword Focus
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setShowImgGen(!showImgGen)}
                >
                  Generate Images
                </Button>
              </div>

              {/* Prompt Components */}
              {showfaqPrompt && (
                <FaqPrompt report={currentReport} id={gptId} />
              )}

              {showTablePrompt && (
                <TablePrompt report={currentReport} id={gptId} />
              )}

              {showBulletPrompt && (
                <BulletPrompt report={currentReport} id={gptId} />
              )}

              {showTableOfContentsPrompt && (
                <TableOfContentsPrompt report={currentReport} id={gptId} />
              )}

              {showNumberedListPrompt && (
                <NumberedListPrompt report={currentReport} id={gptId} />
              )}

              {showDataPrompt && (
                <DataPrompt content={currentReport} report={selectedReport} id={gptId} />
              )}

              {showSingleKey && (
                <SingleFocusedKeywordPrompt report={selectedReport} id={gptId} />
              )}

              {showImgGen && (
                <ImageGeneratorWithSelector content={currentReport} report={selectedReport} id={gptId} />
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* WordPress Login Required */}
      {isAuthenticated === false && !noContent && (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-red-600" />
              WordPress Login Required
            </CardTitle>
            <CardDescription>
              Enter your WordPress credentials to access page content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="username">WordPress Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                value={wName}
                onChange={(e) => setWName(e.target.value)}
              />
              <p className="text-xs text-gray-600 mt-1">Example: USER</p>
            </div>
            <div>
              <Label htmlFor="password">Application Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter application password"
                value={wPassword}
                onChange={(e) => setWPassword(e.target.value)}
              />
              <p className="text-xs text-gray-600 mt-1">Example: s2GS jGiR MhPX 2gXG yElr 0y4R</p>
            </div>
            <Button onClick={wLoginBtn} className="w-full">
              Login to WordPress
            </Button>
            
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="pt-4">
                <h4 className="font-medium text-yellow-900 text-sm mb-2">
                  How to Generate Application Password
                </h4>
                <div className="text-xs text-yellow-800 space-y-1">
                  <p>1. Log in to WordPress Admin Panel</p>
                  <p>2. Go to Users → Your Profile</p>
                  <p>3. Scroll to Application Passwords section</p>
                  <p>4. Enter app name and click "Add New"</p>
                  <p>5. Copy the generated password</p>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      )}

      {/* No Content Found */}
      {noContent && (
        <Card className="max-w-md mx-auto border-red-200">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="font-semibold text-red-900 mb-2">No Content Found</h3>
            <p className="text-sm text-red-700">
              We couldn't fetch any content from WordPress for this page. 
              Please check the URL or try again later.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
