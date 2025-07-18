
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Globe, AlertCircle, CheckCircle2 } from 'lucide-react';

interface SeoAuditProps {
  baseUrl: string;
}

export const SeoAudit = ({ baseUrl }: SeoAuditProps) => {
  const [url, setUrl] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(false);

  const validateUrl = (inputUrl: string): boolean => {
    try {
      // Add protocol if missing
      let urlToValidate = inputUrl.trim();
      if (!urlToValidate.startsWith('http://') && !urlToValidate.startsWith('https://')) {
        urlToValidate = 'https://' + urlToValidate;
      }

      const url = new URL(urlToValidate);
      
      // Check if it's a valid domain
      if (!url.hostname || url.hostname.length < 3) {
        return false;
      }

      // Check if hostname contains at least one dot
      if (!url.hostname.includes('.')) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  };

  const handleUrlChange = (value: string) => {
    setUrl(value);
    setValidationError('');
    
    if (value.trim() === '') {
      setIsValidUrl(false);
      return;
    }

    const isValid = validateUrl(value);
    setIsValidUrl(isValid);
    
    if (!isValid) {
      setValidationError('Please enter a valid website URL (e.g., example.com or https://example.com)');
    }
  };

  const handleStartAudit = async () => {
    if (!isValidUrl || !url.trim()) {
      setValidationError('Please enter a valid website URL');
      return;
    }

    setIsValidating(true);
    
    // Simulate validation process
    setTimeout(() => {
      setIsValidating(false);
      console.log('Starting SEO audit for:', url);
      // TODO: Implement actual audit logic
    }, 2000);
  };

  const formatUrlForDisplay = (inputUrl: string): string => {
    if (!inputUrl) return '';
    
    let formattedUrl = inputUrl.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }
    
    try {
      const url = new URL(formattedUrl);
      return url.href;
    } catch {
      return inputUrl;
    }
  };

  return (
    <div className="space-y-6">
      {/* URL Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-purple-600" />
            Website URL Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="website-url">Website URL</Label>
            <div className="relative">
              <Input
                id="website-url"
                type="text"
                placeholder="Enter website URL (e.g., example.com)"
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                className={`pr-10 ${validationError ? 'border-red-500' : isValidUrl ? 'border-green-500' : ''}`}
              />
              {url && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {isValidUrl ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>
              )}
            </div>
            
            {validationError && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {validationError}
              </p>
            )}
            
            {isValidUrl && (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Valid URL: {formatUrlForDisplay(url)}
              </p>
            )}
          </div>

          <Button 
            onClick={handleStartAudit}
            disabled={!isValidUrl || isValidating}
            className="bg-purple-600 hover:bg-purple-700 w-full md:w-auto"
          >
            {isValidating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Validating URL...
              </>
            ) : (
              'Start SEO Audit'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Audit Features Preview */}
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-purple-900">What We'll Analyze</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
              <div>
                <h4 className="font-medium text-purple-900">Technical SEO</h4>
                <p className="text-sm text-purple-700">Page speed, mobile-friendliness, crawlability</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
              <div>
                <h4 className="font-medium text-purple-900">On-Page SEO</h4>
                <p className="text-sm text-purple-700">Meta tags, headings, content structure</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
              <div>
                <h4 className="font-medium text-purple-900">Content Analysis</h4>
                <p className="text-sm text-purple-700">Keyword usage, readability, uniqueness</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
              <div>
                <h4 className="font-medium text-purple-900">Link Analysis</h4>
                <p className="text-sm text-purple-700">Internal linking, external links quality</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
              <div>
                <h4 className="font-medium text-purple-900">Security & HTTPS</h4>
                <p className="text-sm text-purple-700">SSL certificate, security headers</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
              <div>
                <h4 className="font-medium text-purple-900">Performance</h4>
                <p className="text-sm text-purple-700">Loading speed, Core Web Vitals</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
